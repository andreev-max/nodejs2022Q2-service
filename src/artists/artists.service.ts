import { Injectable } from '@nestjs/common';
import { isValidUuid } from 'src/utils/isValidUuid';
import { v4 } from 'uuid';
import { Artist } from './database/artist.interface';
import { artistsData } from './database/artists.data';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

interface Response {
  status: number;
  body: Artist | { message: string };
}

@Injectable()
export class ArtistsService {
  public data: Artist[];

  constructor() {
    this.data = artistsData;
  }

  async getAll(): Promise<Artist[]> {
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
            message: `Artist with this id ${id} is not found`,
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

  async create(dto: CreateArtistDto): Promise<Response> {
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
    dto: UpdateArtistDto;
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
            message: `Artist with this id ${id} is not found`,
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
            message: `Artist with this id ${id} has been deleted`,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Artist with this id ${id} is not found`,
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
