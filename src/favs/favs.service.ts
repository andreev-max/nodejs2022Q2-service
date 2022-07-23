import { Injectable } from '@nestjs/common';
import { IFavorites, IFavoritesResponse } from 'src/interfaces';
import db from 'src/db/DB';

@Injectable()
export class FavsService {
  type: string;

  constructor() {
    this.type = 'favorites';
  }

  async getAll(): Promise<IFavorites> {
    return await db.getAllFavorites(this.type);
  }

  async create(id: string, type: string): Promise<IFavoritesResponse> {
    return await db.createFav(type, id);
  }

  async delete(id: string, type: string): Promise<void> {
    return await db.deleteFav(type, id);
  }
}
