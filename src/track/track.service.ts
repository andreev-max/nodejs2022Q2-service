import { Injectable, NotFoundException } from '@nestjs/common';
import { Track } from '@prisma/client';
import { entityIsNotFound, ENTITY_TYPES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';

import { CreateTrackDto } from './dto/create-track.dto';
import { UpdateTrackDto } from './dto/update-track.dto';

@Injectable()
export class TrackService {
  type: string;

  constructor(private readonly prisma: PrismaService) {
    this.type = ENTITY_TYPES.TRACK;
  }

  async findAll(): Promise<Track[]> {
    return await this.prisma.track.findMany();
  }

  async findById(id: string): Promise<Track> {
    try {
      const foundTrack = await this.prisma.track.findUnique({
        where: { id },
      });

      if (foundTrack) {
        return foundTrack;
      }

      throw new NotFoundException(entityIsNotFound(this.type, id));
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async create(data: CreateTrackDto): Promise<Track> {
    return await this.prisma.track.create({
      data,
    });
  }

  async update(id: string, data: UpdateTrackDto): Promise<Track> {
    try {
      return await this.prisma.track.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.track.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }
}
