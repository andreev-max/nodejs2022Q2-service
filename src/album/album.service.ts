import { Injectable, NotFoundException } from '@nestjs/common';
import { Album } from '@prisma/client';
import { entityIsNotFound, ENTITY_TYPES } from 'src/constants';
import { PrismaService } from 'src/prisma.service';

import { CreateAlbumDto } from './dto/create-album.dto';
import { UpdateAlbumDto } from './dto/update-album.dto';

@Injectable()
export class AlbumService {
  type: string;

  constructor(private readonly prisma: PrismaService) {
    this.type = ENTITY_TYPES.ALBUM;
  }

  async findAll(): Promise<Album[]> {
    return await this.prisma.album.findMany();
  }

  async findById(id: string): Promise<Album> {
    try {
      const foundAlbum = await this.prisma.album.findUnique({
        where: { id },
      });

      if (!foundAlbum) {
        throw new NotFoundException(entityIsNotFound(this.type, id));
      }

      return foundAlbum;
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async create(data: CreateAlbumDto): Promise<Album> {
    return await this.prisma.album.create({
      data,
    });
  }

  async update(id: string, data: UpdateAlbumDto): Promise<Album> {
    try {
      return await this.prisma.album.update({
        where: { id },
        data,
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }

  async delete(id: string): Promise<void> {
    try {
      await this.prisma.album.delete({
        where: { id },
      });
    } catch (e) {
      throw new NotFoundException(entityIsNotFound(this.type, id));
    }
  }
}
