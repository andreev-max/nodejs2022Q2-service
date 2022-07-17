import { Injectable } from '@nestjs/common';
import { Track } from 'src/tracks/database/track.interface';
import { tracksData } from 'src/tracks/database/tracks.data';
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
  public albumsData: Album[];
  public tracksData: Track[];

  constructor() {
    this.albumsData = albumsData;
    this.tracksData = tracksData;
  }

  async getAll(): Promise<Album[]> {
    return this.albumsData;
  }

  async getOneById(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundItem = this.albumsData.find((item) => item.id === id);

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
    this.albumsData.push(newItem);

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
    if (isValidUuid(id)) {
      const foundItemIndex = this.albumsData.findIndex(
        (item) => item.id === id,
      );

      if (foundItemIndex > -1) {
        const foundItem = this.albumsData[foundItemIndex];
        this.albumsData[foundItemIndex] = {
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
      const foundItemIndex = this.albumsData.findIndex(
        (item) => item.id === id,
      );

      if (foundItemIndex > -1) {
        this.albumsData.splice(foundItemIndex, 1);

        const foundTrackId = tracksData.findIndex(
          (track) => track.albumId === id,
        );
        if (foundTrackId) {
          const foundTrack = tracksData[foundTrackId];
          tracksData.splice(foundItemIndex, 1, {
            ...foundTrack,
            albumId: null,
          });
        }

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
