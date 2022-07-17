import { Controller, Delete, Get, Param, Post, Res } from '@nestjs/common';
import { FavoritesService } from './favorites.service';
import { Response } from 'express';

@Controller('favs')
export class FavoritesController {
  constructor(private readonly favoritesService: FavoritesService) {}

  @Get()
  getAll() {
    return this.favoritesService.getAll();
  }

  @Post('/track/:id')
  async addTrack(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.favoritesService.addTrack(id);
    res.status(status).send(body);
  }

  @Post('/album/:id')
  async addAlbum(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.favoritesService.addAlbum(id);
    res.status(status).send(body);
  }

  @Post('/artist/:id')
  async addArtis(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.favoritesService.addArtist(id);
    res.status(status).send(body);
  }

  @Delete('/track/:id')
  async deleteTrack(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.favoritesService.deleteTrack(id);
    res.status(status).send(body);
  }

  @Delete('/album/:id')
  async deleteAlbum(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.favoritesService.deleteAlbum(id);
    res.status(status).send(body);
  }

  @Delete('/artist/:id')
  async deleteArtist(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.favoritesService.deleteArtist(id);
    res.status(status).send(body);
  }
}
