import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import 'dotenv/config';
import { AppModule } from './app.module';

const PORT = process.env.PORT || 4000;

async function start() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
  );

  const apiFile = await readFile(
    join(dirname(__dirname), 'doc', 'api.yaml'),
    'utf-8',
  );

  const parsedApiFile = parse(apiFile);

  SwaggerModule.setup('doc', app, parsedApiFile);

  await app.listen(PORT, () =>
    console.log(`The best application in the world is running on port ${PORT}`),
  );
}

start();
