import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';

import { TrackService } from './track.service';
import { TrackController } from './track.controller';

@Module({
  providers: [TrackService, PrismaService],
  controllers: [TrackController],
})
export class TrackModule {}
