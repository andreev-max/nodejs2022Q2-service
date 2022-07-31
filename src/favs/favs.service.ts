import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { FavsEntityTypes } from 'src/constants';
import { PrismaService } from 'src/prisma.service';

@Injectable()
export class FavsService {
  constructor(private readonly prisma: PrismaService) {}

  async getAllFavs() {
    return (
      (await this.prisma.favorites.findFirst({
        select: {
          artists: {
            select: {
              id: true,
              name: true,
              grammy: true,
            },
          },
          tracks: {
            select: {
              id: true,
              name: true,
              duration: true,
              artistId: true,
              albumId: true,
            },
          },
          albums: {
            select: {
              id: true,
              name: true,
              year: true,
              artistId: true,
            },
          },
        },
      })) || { artists: [], tracks: [], albums: [] }
    );
  }

  async addEntityToFavorite(type: FavsEntityTypes, id: string) {
    const entity = await this.prisma[type].findFirst({ where: { id } });
    if (!entity) throw new UnprocessableEntityException();

    const favorites = await this.prisma.favorites.findMany();

    if (!favorites.length) {
      const create = await this.prisma.favorites.create({
        data: {},
      });
      await this.prisma[type].update({
        where: { id },
        data: { favoritesId: create.id },
      });
    } else {
      await this.prisma[type].update({
        where: { id },
        data: {
          favoritesId: favorites[0].id,
        },
      });
    }
  }

  async delete(type: FavsEntityTypes, id: string) {
    return await this.prisma[type].update({
      where: { id },
      data: {
        favoritesId: { set: null },
      },
    });
  }
}
