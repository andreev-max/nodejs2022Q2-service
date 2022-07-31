import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  Put,
  HttpStatus,
} from '@nestjs/common';
import { TrackService } from './track.service';
import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';
import { ENTITY_TYPES } from 'src/constants';

@Controller(ENTITY_TYPES.TRACK)
export class TrackController {
  constructor(private readonly service: TrackService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  findById(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ) {
    return this.service.findById(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(
    @Body()
    createTrackDto: CreateTrackDto,
  ) {
    return this.service.create(createTrackDto);
  }

  @Put(':id')
  @HttpCode(HttpStatus.OK)
  update(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
    @Body() updateTrackDto: UpdateTrackDto,
  ) {
    return this.service.update(id, updateTrackDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Param('id', new ParseUUIDPipe({ version: '4' }))
    id: string,
  ) {
    return this.service.delete(id);
  }
}
