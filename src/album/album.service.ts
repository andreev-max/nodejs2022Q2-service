import { Injectable } from '@nestjs/common';
import { v4 } from 'uuid';

import { IAlbum, ITrack } from 'src/interfaces';
import db from 'src/db/DB';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  type: string;

  constructor() {
    this.type = 'album';
  }

  async getAll(): Promise<IAlbum[]> {
    return (await db.getAll(this.type)) as IAlbum[];
  }

  async getOneById(id: string): Promise<IAlbum> {
    return (await db.getOneById(this.type, id)) as IAlbum;
  }

  async create(createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    const newAlbum = {
      ...createAlbumDto,
      id: v4(),
    };

    return (await db.create(this.type, newAlbum)) as IAlbum;
  }

  async update(id: string, updateAlbumDto: UpdateAlbumDto): Promise<IAlbum> {
    const oldAlbum = (await db.getOneById(this.type, id)) as IAlbum;

    const updateAlbum = {
      ...oldAlbum,
      ...updateAlbumDto,
    };

    return (await db.update(this.type, id, updateAlbum)) as IAlbum;
  }

  async delete(id: string): Promise<IAlbum> {
    const deletedAlbum = (await db.delete(this.type, id)) as IAlbum;

    const allTracks = (await db.getAll('track')) as ITrack[];
    const allFavorites = await db.getAllFavorites('favorites');

    const favAlbums: IAlbum[] = allFavorites[this.type + 's'];

    allTracks.forEach((track: ITrack) => {
      if (track?.albumId === deletedAlbum.id)
        db.update('track', track?.id, { ...track, albumId: null });
    });

    const newFavAlbum = favAlbums.filter(
      (album) => album?.id !== deletedAlbum.id,
    );

    db.updateFav(this.type, newFavAlbum);

    return deletedAlbum;
  }
}
