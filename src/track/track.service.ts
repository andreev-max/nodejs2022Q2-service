import { Injectable } from '@nestjs/common';
import { IFavorites, ITrack } from 'src/interfaces';
import { v4 } from 'uuid';
import db from '../db/DB';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  type: string;

  constructor() {
    this.type = 'track';
  }

  async getAll(): Promise<ITrack[]> {
    return (await db.getAll(this.type)) as ITrack[];
  }

  async getOneById(id: string): Promise<ITrack> {
    return (await db.getOneById(this.type, id)) as ITrack;
  }

  async create(createTrackDto: CreateTrackDto): Promise<ITrack> {
    const newTrack = {
      ...createTrackDto,
      id: v4(),
    };

    return (await db.create(this.type, newTrack)) as ITrack;
  }

  async update(id: string, updateTrackDto: UpdateTrackDto): Promise<ITrack> {
    const oldTrack = (await db.getOneById(this.type, id)) as ITrack;

    const updateTrack = {
      ...oldTrack,
      ...updateTrackDto,
    };

    return (await db.update(this.type, id, updateTrack)) as ITrack;
  }

  async delete(id: string): Promise<ITrack> {
    const deletedTrack = (await db.delete(this.type, id)) as ITrack;

    const favorites: IFavorites = await db.getAllFavorites('favorites');

    const favTracks: ITrack[] = favorites[this.type + 's'];

    const newFavTracks = favTracks.filter(
      (track) => track?.id !== deletedTrack.id,
    );

    db.updateFav(this.type, newFavTracks);

    return deletedTrack;
  }
}
