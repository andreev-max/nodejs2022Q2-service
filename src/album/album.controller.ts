import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
} from '@nestjs/common';

import { IAlbum } from 'src/interfaces';

import { AlbumService } from './album.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  getAll(): Promise<IAlbum[]> {
    return this.albumService.getAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  getOneById(@Param('id') id: string): Promise<IAlbum> {
    return this.albumService.getOneById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() createAlbumDto: CreateAlbumDto): Promise<IAlbum> {
    return this.albumService.create(createAlbumDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Body() updateAlbumDto: UpdateAlbumDto,
    @Param('id') id: string,
  ): Promise<IAlbum> {
    return this.albumService.update(id, updateAlbumDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id') id: string): Promise<IAlbum> {
    return this.albumService.delete(id);
  }
}
