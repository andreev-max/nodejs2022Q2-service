import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { TrackController } from './track.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [TrackService, PrismaService],
  controllers: [TrackController],
})
export class TrackModule {}
