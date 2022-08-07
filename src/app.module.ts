import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { TrackModule } from './track/track.module';
import { ArtistModule } from './artist/artist.module';
import { AlbumModule } from './album/album.module';
import { FavsModule } from './favs/favs.module';
import { LoggerMiddleware } from './utils/logger/logger.middleware';
import { HttpExceptionFilter } from './utils/http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { AccessTokenGuard } from './utils/access-token.guard';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    UserModule,
    TrackModule,
    ArtistModule,
    AlbumModule,
    FavsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: HttpExceptionFilter,
    },
    { provide: APP_GUARD, useClass: AccessTokenGuard },
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: ':splat*', method: RequestMethod.ALL });
  }
}
