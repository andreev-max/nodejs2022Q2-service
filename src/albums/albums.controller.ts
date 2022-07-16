import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { AlbumsService } from './albums.service';
import { Album } from './database/album.interface';
import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Controller('album')
export class AlbumsController {
  constructor(private readonly service: AlbumsService) {}

  @Get()
  getAll(): Promise<Album[]> {
    return this.service.getAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.service.getOneById(id);
    res.status(status).send(body);
  }

  @Post()
  async create(@Body() dto: CreateAlbumDto, @Res() res: Response) {
    const { status, body } = await this.service.create(dto);
    res.status(status).send(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateAlbumDto,
    @Res() res: Response,
  ) {
    const { status, body } = await this.service.update({
      id,
      dto,
    });
    res.status(status).send(body);
  }

  @Delete(':id')
  async delete(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.service.delete(id);
    res.status(status).send(body);
  }
}
