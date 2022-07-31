import { Injectable, NotFoundException } from '@nestjs/common';
import { Artist } from '@prisma/client';
import { entityIsNotFound, ENTITY_TYPES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';
import { CreateArtistDto } from './dto/create-artist.dto';
import { UpdateArtistDto } from './dto/update-artist.dto';

@Injectable()
export class ArtistService {
  type: string;

  constructor(private readonly prisma: PrismaService) {
    this.type = ENTITY_TYPES.ARTIST;
  }

  async findAll(): Promise<Artist[]> {
    return await this.prisma.artist.findMany();
  }

  async findById(id: string): Promise<Artist> {
    try {
      const foundArtist = await this.prisma.artist.findUnique({
        where: { id },
      });

      if (foundArtist) {
        return foundArtist;
      }

      throw new NotFoundException(entityIsNotFound(this.type, id));
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async create(data: CreateArtistDto): Promise<Artist> {
    return await this.prisma.artist.create({
      data,
    });
  }

  async update(id: string, data: UpdateArtistDto): Promise<Artist> {
    try {
      return await this.prisma.artist.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.artist.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }
}
