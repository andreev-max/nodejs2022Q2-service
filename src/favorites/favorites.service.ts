import { Injectable } from '@nestjs/common';
import { Album } from 'src/albums/database/album.interface';
import { Artist } from 'src/artists/database/artist.interface';
import { Track } from 'src/tracks/database/track.interface';
import { artistsData } from 'src/artists/database/artists.data';
import { albumsData } from 'src/albums/database/albums.data';
import { tracksData } from 'src/tracks/database/tracks.data';
import { favoritesData } from './database/favorites.data';
import { Favorites } from './database/favorites.interface';
import { isValidUuid } from 'src/utils/isValidUuid';

export interface Response {
  artists: Artist[];
  albums: Album[];
  tracks: Track[];
}

interface AddTrackResponse {
  status: number;
  body: { tracks: Track } | { message: string };
}

interface AddAlbumResponse {
  status: number;
  body: { albums: Album } | { message: string };
}

interface AddArtistResponse {
  status: number;
  body: { artists: Artist } | { message: string };
}

interface DeleteTrackResponse {
  status: number;
  body: { tracks: Track[] } | { message: string };
}

interface DeleteAlbumResponse {
  status: number;
  body: { albums: Album[] } | { message: string };
}

interface DeleteArtistResponse {
  status: number;
  body: { artists: Artist[] } | { message: string };
}

@Injectable()
export class FavoritesService {
  public artistsData: Artist[];
  public albumsData: Album[];
  public tracksData: Track[];
  public favoritesData: Favorites;

  constructor() {
    this.artistsData = artistsData;
    this.albumsData = albumsData;
    this.tracksData = tracksData;
    this.favoritesData = favoritesData;
  }

  async getAll(): Promise<Response> {
    const artists = this.favoritesData.artists.map((artistId) => {
      const foundArtist = artistsData.find((artist) => artist.id === artistId);
      if (foundArtist) {
        return foundArtist;
      }
    });
    const tracks = this.favoritesData.tracks.map((trackId) => {
      const foundTrack = tracksData.find((track) => track.id === trackId);
      if (foundTrack) {
        return foundTrack;
      }
    });
    const albums = this.favoritesData.albums.map((albumId) => {
      const foundAlbum = albumsData.find((album) => album.id === albumId);
      if (foundAlbum) {
        return foundAlbum;
      }
    });

    return {
      artists: artists.filter((artist) => artist?.name),
      albums: albums.filter((album) => album?.name),
      tracks: tracks.filter((track) => track?.name),
    };
  }

  async addTrack(id: string): Promise<AddTrackResponse> {
    if (isValidUuid(id)) {
      const foundTrack = tracksData.find((track) => track.id === id);

      if (foundTrack) {
        this.favoritesData.tracks.push(id);

        return {
          status: 201,
          body: { tracks: foundTrack },
        };
        // message: `Track with this id ${id} was added to your favorites`,
      } else {
        return {
          status: 422,
          body: {
            message: `Track with this id ${id} does not exist`,
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

  async addAlbum(id: string): Promise<AddAlbumResponse> {
    if (isValidUuid(id)) {
      const foundAlbum = albumsData.find((album) => album.id === id);

      if (foundAlbum) {
        this.favoritesData.albums.push(id);

        return {
          status: 201,
          body: { albums: foundAlbum },
        };
      } else {
        return {
          status: 422,
          body: {
            message: `Album with this id ${id} does not exist`,
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

  async addArtist(id: string): Promise<AddArtistResponse> {
    if (isValidUuid(id)) {
      const foundArtist = artistsData.find((artist) => artist.id === id);

      if (foundArtist) {
        this.favoritesData.artists.push(id);

        return {
          status: 201,
          body: { artists: foundArtist },
        };
      } else {
        return {
          status: 422,
          body: {
            message: `Artist with this id ${id} does not exist`,
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

  async deleteTrack(id: string): Promise<DeleteTrackResponse> {
    if (isValidUuid(id)) {
      const foundFavoriteTrackIdIndex = this.favoritesData.tracks.findIndex(
        (trackId) => trackId === id,
      );

      if (foundFavoriteTrackIdIndex > -1) {
        this.favoritesData.tracks.splice(foundFavoriteTrackIdIndex, 1);
        return {
          status: 204,
          body: { tracks: tracksData },
        };
        // message: `Track with this id ${id} was added to your favorites`,
      } else {
        return {
          status: 404,
          body: {
            message: `Track with this id ${id} is not favorite`,
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

  async deleteAlbum(id: string): Promise<DeleteAlbumResponse> {
    if (isValidUuid(id)) {
      const foundFavoriteAlbumIdIndex = this.favoritesData.albums.findIndex(
        (albumId) => albumId === id,
      );

      if (foundFavoriteAlbumIdIndex > -1) {
        this.favoritesData.albums.splice(foundFavoriteAlbumIdIndex, 1);
        return {
          status: 204,
          body: {
            message: `Album with this id ${id} was deleted from your favorites albums`,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Album with this id ${id} is not favorite`,
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

  async deleteArtist(id: string): Promise<DeleteArtistResponse> {
    if (isValidUuid(id)) {
      const foundFavoriteArtistIdIndex = this.favoritesData.artists.findIndex(
        (artistId) => artistId === id,
      );

      if (foundFavoriteArtistIdIndex > -1) {
        this.favoritesData.artists.splice(foundFavoriteArtistIdIndex, 1);
        return {
          status: 204,
          body: {
            message: `Artist with this id ${id} was deleted from your favorites artists`,
          },
        };
      } else {
        return {
          status: 404,
          body: {
            message: `Artist with this id ${id} is not favorite`,
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
