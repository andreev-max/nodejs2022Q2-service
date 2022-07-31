import { Module } from '@nestjs/common';

import { FavsService } from './favs.service';
import { FavsController } from './favs.controller';
import { PrismaService } from 'src/prisma.service';

@Module({
  providers: [FavsService, PrismaService],
  controllers: [FavsController],
})
export class FavsModule {}
