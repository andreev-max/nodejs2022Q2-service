import { Injectable } from '@nestjs/common';
import { isValidUuid } from 'src/utils/isValidUuid';
import { v4 } from 'uuid';
import { Track } from './database/track.interface';
import { tracksData } from './database/tracks.data';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

interface Response {
  status: number;
  body: Track | { message: string };
}

@Injectable()
export class TracksService {
  public tracksData: Track[];

  constructor() {
    this.tracksData = tracksData;
  }

  async getAll(): Promise<Track[]> {
    return this.tracksData;
  }

  async getOneById(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundItem = this.tracksData.find((item) => item.id === id);

      if (foundItem) {
        return {
          status: 200,
          body: foundItem,
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Track with this id ${id} is not found`,
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

  async create(dto: CreateTrackDto): Promise<Response> {
    const newItem = { ...dto, id: v4() };
    this.tracksData.push(newItem);

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
    dto: UpdateTrackDto;
  }): Promise<Response> {
    if (isValidUuid(id)) {
      const foundItemIndex = this.tracksData.findIndex(
        (item) => item.id === id,
      );

      if (foundItemIndex > -1) {
        const foundItem = this.tracksData[foundItemIndex];
        this.tracksData[foundItemIndex] = {
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
            message: `Track with this id ${id} is not found`,
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
      const foundItemIndex = this.tracksData.findIndex(
        (item) => item.id === id,
      );

      if (foundItemIndex > -1) {
        this.tracksData.splice(foundItemIndex, 1);
        return {
          status: 204,
          body: {
            message: `Track with this id ${id} has been deleted`,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Track with this id ${id} is not found`,
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
