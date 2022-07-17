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
import { ArtistsService } from './artists.service';
import { Artist } from './database/artist.interface';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Controller('artist')
export class ArtistsController {
  constructor(private readonly service: ArtistsService) {}

  @Get()
  getAll(): Promise<Artist[]> {
    return this.service.getAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.service.getOneById(id);
    res.status(status).send(body);
  }

  @Post()
  async create(@Body() dto: CreateArtistDto, @Res() res: Response) {
    const { status, body } = await this.service.create(dto);
    res.status(status).send(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateArtistDto,
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
