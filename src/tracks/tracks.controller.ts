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
import { Track } from './database/track.interface';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { TracksService } from './tracks.service';

@Controller('track')
export class TracksController {
  constructor(private readonly service: TracksService) {}

  @Get()
  getAll(): Promise<Track[]> {
    return this.service.getAll();
  }

  @Get(':id')
  async getOneById(@Param('id') id: string, @Res() res: Response) {
    const { status, body } = await this.service.getOneById(id);
    res.status(status).send(body);
  }

  @Post()
  async create(@Body() dto: CreateTrackDto, @Res() res: Response) {
    const { status, body } = await this.service.create(dto);
    res.status(status).send(body);
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTrackDto,
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
