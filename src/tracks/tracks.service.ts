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
  public data: Track[];

  constructor() {
    this.data = tracksData;
  }

  async getAll(): Promise<Track[]> {
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
    dto: UpdateTrackDto;
  }): Promise<Response> {
    console.log(dto);
    if (isValidUuid(id)) {
      const foundItemIndex = this.data.findIndex((item) => item.id === id);

      if (foundItemIndex > -1) {
        const foundItem = this.data[foundItemIndex];
        // if (foundUser.password === oldPassword) {
        //   this.data[foundItemIndex] = {
        //     ...foundUser,
        //     password: newPassword,
        //   };

        return {
          status: 200,
          body: foundItem,
        };
        // } else {
        //   return {
        //     status: 403,
        //     body: {
        //       message: `The old password you entered is not the correct one.`,
        //     },
        //   };
        // }
      } else {
        return {
          status: 404,
          body: {
            message: `User with this id ${id} is not found`,
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
