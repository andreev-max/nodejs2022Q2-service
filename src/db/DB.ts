import {
  NotFoundException,
  BadRequestException,
  UnprocessableEntityException,
  HttpStatus,
} from '@nestjs/common';
import { validate } from 'uuid';
import { MESSAGES, entityIsNotFound, favIsNotFound } from 'src/utils/constants';
import {
  IUser,
  IArtist,
  IAlbum,
  ITrack,
  IFavorites,
  Entity,
  IFavoritesResponse,
} from 'src/utils/interfaces';

class DB {
  user: IUser[] = [];
  artist: IArtist[] = [];
  album: IAlbum[] = [];
  track: ITrack[] = [];
  favorites: IFavorites = {
    artists: [] as IArtist[],
    albums: [] as IAlbum[],
    tracks: [] as ITrack[],
  };

  async getAll(type: string): Promise<Entity[]> {
    return new Promise((res) => {
      return res(this[type]);
    });
  }

  async getOneById(type: string, id: string): Promise<Entity> {
    return new Promise((res, rej) => {
      if (!validate(id)) {
        return rej(new BadRequestException(MESSAGES.BAD_REQUEST));
      }

      const foundEntity = this[type]?.find(
        (entity: Entity) => entity.id === id,
      );

      if (!foundEntity) {
        return rej(new NotFoundException(entityIsNotFound(type, id)));
      }

      return res(foundEntity);
    });
  }

  async create(type: string, body: Entity): Promise<Entity> {
    return new Promise((res) => {
      this[type]?.push(body);
      return res(body);
    });
  }

  async update(type: string, id: string, body: Entity): Promise<Entity> {
    return new Promise((res, rej) => {
      if (!validate(id)) {
        return rej(new BadRequestException(MESSAGES.BAD_REQUEST));
      }

      const foundEntity = this[type]?.find(
        (entity: Entity) => entity.id === id,
      );

      if (!foundEntity) {
        return rej(new NotFoundException(entityIsNotFound(type, id)));
      }

      this[type] = this[type]?.map((entity: Entity) =>
        entity.id === body.id ? body : entity,
      );

      return res(body);
    });
  }

  async delete(type: string, id: string): Promise<Entity> {
    return new Promise((res, rej) => {
      if (!validate(id)) {
        return rej(new BadRequestException(MESSAGES.BAD_REQUEST));
      }

      const foundEntity = this[type]?.find(
        (entity: Entity) => entity.id === id,
      );

      if (!foundEntity) {
        return rej(new NotFoundException(entityIsNotFound(type, id)));
      }

      this[type] = this[type]?.filter((entity: Entity) => entity.id !== id);

      return res(foundEntity);
    });
  }

  async getAllFavorites(type: string): Promise<IFavorites> {
    return new Promise((res) => {
      return res(this[type]);
    });
  }

  async createFav(type: string, id: string): Promise<IFavoritesResponse> {
    return new Promise((res, rej) => {
      if (!validate(id)) {
        return rej(new BadRequestException(MESSAGES.BAD_REQUEST));
      }

      const foundEntity = this[type]?.find(
        (entity: Entity) => entity.id === id,
      );

      if (!foundEntity) {
        return rej(new UnprocessableEntityException(favIsNotFound(type, id)));
      }

      if (
        this.favorites[type + 's'].some((entity: Entity) => entity.id === id)
      ) {
        return rej(new BadRequestException(MESSAGES.DUBLICATE_DATA));
      }

      this.favorites[type + 's'].push(foundEntity);

      const response = {
        statusCode: HttpStatus.CREATED,
        message: MESSAGES.ADDED_SUCCESSFULY,
      };

      return res(response);
    });
  }

  async updateFav(type: string, favs: Entity[]): Promise<Entity[]> {
    return new Promise((res) => {
      this.favorites[type + 's'] = favs;
      return res(favs);
    });
  }

  async deleteFav(type: string, id: string): Promise<void> {
    return new Promise((res, rej) => {
      if (!validate(id)) {
        return rej(new BadRequestException(MESSAGES.BAD_REQUEST));
      }

      const foundEntity = this.favorites[type + 's']?.find(
        (entity: Entity) => entity?.id === id,
      );

      if (!foundEntity) {
        return rej(new NotFoundException(entityIsNotFound(type, id)));
      }

      this.favorites[type + 's'] = this.favorites[type + 's']?.filter(
        (entity: Entity) => entity?.id !== id,
      );

      return res(foundEntity);
    });
  }
}

const db = new DB();

export default db;
