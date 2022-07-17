import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { writeFileSync } from 'fs';
import { AppModule } from './app.module';

async function start() {
  try {
    const PORT = process.env.PORT || 4000;
    const app = await NestFactory.create(AppModule);
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
      }),
    );

    const config = new DocumentBuilder()
      .setTitle('Service NodeJS')
      .setDescription('The service API description')
      .setVersion('1.0.0')
      .addTag('service')
      .build();

    const document = SwaggerModule.createDocument(app, config);

    writeFileSync('./doc/swagger.json', JSON.stringify(document));

    SwaggerModule.setup('api', app, document);

    await app.listen(PORT);
    console.log(`Application is running on: ${await app.getUrl()}`);
  } catch (e) {
    console.log(e);
  }
}
start();
