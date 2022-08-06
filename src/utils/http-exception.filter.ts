import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';

import { MyLogger } from './logger/logger.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();

    const logger = new MyLogger('FILTER');
    logger.error(exception.message, exception.stack);

    response.status(status).json({
      statusCode: status,
      timestamp: Date.now(),
      path: request.url,
      message: exception.message,
    });
  }
}
