import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
} from '@nestjs/common';

import { IFavorites, IFavoritesResponse } from 'src/interfaces';

import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private readonly favsService: FavsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<IFavorites> {
    return this.favsService.getAll();
  }

  @Post(':type/:id')
  @HttpCode(HttpStatus.CREATED)
  create(
    @Param('id') id: string,
    @Param('type') type: string,
  ): Promise<IFavoritesResponse> {
    return this.favsService.create(id, type);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string, @Param('type') type: string): Promise<void> {
    return this.favsService.delete(id, type);
  }
}
