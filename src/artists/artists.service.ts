import { Injectable } from '@nestjs/common';
import { Album } from 'src/albums/database/album.interface';
import { albumsData } from 'src/albums/database/albums.data';
import { Track } from 'src/tracks/database/track.interface';
import { tracksData } from 'src/tracks/database/tracks.data';
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
  public artistsData: Artist[];
  public albumsData: Album[];
  public tracksData: Track[];

  constructor() {
    this.artistsData = artistsData;
    this.albumsData = albumsData;
    this.tracksData = tracksData;
  }

  async getAll(): Promise<Artist[]> {
    return this.artistsData;
  }

  async getOneById(id: string): Promise<Response> {
    if (isValidUuid(id)) {
      const foundItem = this.artistsData.find((item) => item.id === id);

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
    this.artistsData.push(newItem);

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
    if (isValidUuid(id)) {
      const foundItemIndex = this.artistsData.findIndex(
        (item) => item.id === id,
      );

      if (foundItemIndex > -1) {
        const foundItem = this.artistsData[foundItemIndex];
        this.artistsData[foundItemIndex] = {
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
      const foundItemIndex = this.artistsData.findIndex(
        (item) => item.id === id,
      );

      if (foundItemIndex > -1) {
        this.artistsData.splice(foundItemIndex, 1);

        const foundTrackId = tracksData.findIndex(
          (track) => track.artistId === id,
        );
        if (foundTrackId) {
          const foundTrack = tracksData[foundTrackId];
          tracksData.splice(foundItemIndex, 1, {
            ...foundTrack,
            artistId: null,
          });
        }

        const foundAlbumId = albumsData.findIndex(
          (album) => album.artistId === id,
        );
        if (foundAlbumId) {
          const foundAlbum = albumsData[foundAlbumId];
          albumsData.splice(foundItemIndex, 1, {
            ...foundAlbum,
            artistId: null,
          });
        }

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
