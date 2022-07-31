import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { IAlbum, IArtist, ITrack } from 'src/interfaces';
import db from 'src/db/DB';

import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  type: string;

  constructor() {
    this.type = 'artist';
  }

  async getAll(): Promise<IArtist[]> {
    return (await db.getAll(this.type)) as IArtist[];
  }

  async getOneById(id: string): Promise<IArtist> {
    return (await db.getOneById(this.type, id)) as IArtist;
  }

  async create(createArtistDto: CreateArtistDto): Promise<IArtist> {
    const newArtist = {
      ...createArtistDto,
      id: v4(),
    };

    return (await db.create(this.type, newArtist)) as IArtist;
  }

  async update(id: string, updateArtistDto: UpdateArtistDto): Promise<IArtist> {
    const oldArtist = (await db.getOneById(this.type, id)) as IArtist;

    const updatedArtist = {
      ...oldArtist,
      ...updateArtistDto,
    };

    return (await db.update(this.type, id, updatedArtist)) as IArtist;
  }

  async delete(id: string): Promise<IArtist> {
    const deletedArtist = (await db.delete(this.type, id)) as IArtist;

    const allTracks = (await db.getAll('track')) as ITrack[];

    const allAlbums = (await db.getAll('album')) as IAlbum[];

    const allFavorites = await db.getAllFavorites('favorites');

    const favArtist: IArtist[] = allFavorites[this.type + 's'];

    allTracks.forEach((track: ITrack) => {
      if (track?.artistId === deletedArtist.id)
        db.update('track', track?.id, { ...track, artistId: null });
    });

    allAlbums.forEach((album: IAlbum) => {
      if (album?.artistId === deletedArtist.id)
        db.update('album', album?.id, { ...album, artistId: null });
    });

    const newFavArtist = favArtist.filter(
      (artist) => artist?.id !== deletedArtist.id,
    );

    db.updateFav(this.type, newFavArtist);

    return deletedArtist;
  }
}
