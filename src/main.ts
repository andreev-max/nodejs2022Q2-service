import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule } from '@nestjs/swagger';
import { parse } from 'yaml';
import { dirname, join } from 'path';
import { readFile } from 'fs/promises';
import 'dotenv/config';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';

const PORT = process.env.PORT || 4000;

async function start() {
  try {
    const app = await NestFactory.create(AppModule);

    // const config = new DocumentBuilder()
    //   .setTitle('Service NodeJS')
    //   .setDescription('Documentation')
    //   .setVersion('1.0.0')
    //   .build();
    // const document = SwaggerModule.createDocument(app, config);
    // SwaggerModule.setup('doc', app, document);

    app.enableCors();
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    );

    const apiFile = await readFile(
      join(dirname(__dirname), 'doc', 'api.yaml'),
      'utf-8',
    );

    const parsedApiFile = parse(apiFile);

    SwaggerModule.setup('doc', app, parsedApiFile);

    const prismaService = app.get(PrismaService);
    await prismaService.enableShutdownHooks(app);

    await app.listen(PORT, () =>
      console.log(
        `The best application in the world is running on port ${PORT}`,
      ),
    );
  } catch (e) {
    console.log('ERROR: ', e);
  }
}

start();
