import {
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  HttpStatus,
  ParseUUIDPipe,
} from '@nestjs/common';
import { FavsEntityTypes } from 'src/constants';

import { FavsService } from './favs.service';

@Controller('favs')
export class FavsController {
  constructor(private service: FavsService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAllFavs() {
    return this.service.getAllFavs();
  }

  @Post(':type/:id')
  addEntityToFavorite(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('type') type: FavsEntityTypes,
  ) {
    return this.service.addEntityToFavorite(type, id);
  }

  @Delete(':type/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', new ParseUUIDPipe({ version: '4' })) id: string,
    @Param('type') type: FavsEntityTypes,
  ) {
    return this.service.delete(type, id);
  }
}
