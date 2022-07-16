import { Injectable } from '@nestjs/common';
import { isValidUuid } from 'src/utils/isValidUuid';
import { v4 } from 'uuid';
import { Album } from './database/album.interface';
import { albumsData } from './database/albums.data';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

interface Response {
  status: number;
  body: Album | { message: string };
}

@Injectable()
export class AlbumsService {
  public data: Album[];

  constructor() {
    this.data = albumsData;
  }

  async getAll(): Promise<Album[]> {
    return this.data;
  }

  async getOneById(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundItem = this.data.find((item) => item.id === id);

      if (foundItem) {
        return {
          status: 200,
          body: foundItem,
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Album with this id ${id} is not found`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: `This id ${id} is not valid`,
        },
      };
    }
  }

  async create(dto: CreateAlbumDto): Promise<Response> {
    const newItem = { ...dto, id: v4() };
    this.data.push(newItem);

    return {
      status: 201,
      body: newItem,
    };
  }

  async update({
    id,
    dto,
  }: {
    id: string;
    dto: UpdateAlbumDto;
  }): Promise<Response> {
    console.log(dto);
    if (isValidUuid(id)) {
      const foundItemIndex = this.data.findIndex((item) => item.id === id);

      if (foundItemIndex > -1) {
        const foundItem = this.data[foundItemIndex];
        this.data[foundItemIndex] = {
          ...foundItem,
          ...dto,
        };

        return {
          status: 200,
          body: {
            ...foundItem,
            ...dto,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Album with this id ${id} is not found`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: `This id ${id} is not valid`,
        },
      };
    }
  }

  async delete(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundItemIndex = this.data.findIndex((item) => item.id === id);

      if (foundItemIndex > -1) {
        this.data.splice(foundItemIndex, 1);
        return {
          status: 204,
          body: {
            message: `Album with this id ${id} has been deleted`,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Album with this id ${id} is not found`,
          },
        };
      }
    } else {
      return {
        status: 400,
        body: {
          message: `This id ${id} is not valid`,
        },
      };
    }
  }
}
