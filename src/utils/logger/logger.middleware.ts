import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { inspect } from 'util';

import { MyLogger } from './logger.service';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  private logger = new MyLogger('MIDDLEWARE');

  myInspect(obj: unknown): string {
    return inspect(obj, { showHidden: false, depth: null, colors: true });
  }

  use(request: Request, response: Response, next: NextFunction): void {
    const { body, query, ip, method, originalUrl } = request;
    const userAgent = request.get('user-agent') || 'unknown';

    response.on('finish', () => {
      const { statusCode } = response;
      const contentLength = response.get('content-length');

      const logText = `method: ${method} originalUrl: ${originalUrl} query: ${this.myInspect(
        query,
      )} body: ${this.myInspect(
        body,
      )} statusCode: ${statusCode} contentLength: ${contentLength} - userAgent: ${userAgent} ip: ${ip}`;

      this.logger.log(logText);
    });

    next();
  }
}
