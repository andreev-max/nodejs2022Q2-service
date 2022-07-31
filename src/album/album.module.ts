import { Module } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [AlbumService, PrismaService],
  controllers: [AlbumController],
})
export class AlbumModule {}
