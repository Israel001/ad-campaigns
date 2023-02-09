import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { corsConfiguration } from './config/cors-configuration';
import { json } from 'express';
import { Logger, ValidationPipe } from '@nestjs/common';
require('dotenv').config();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    cors: corsConfiguration,
  });
  app.use(json({ limit: '10mb' }));
  app.disable('x-powered-by');

  app.useGlobalPipes(new ValidationPipe())

  app.enableShutdownHooks();

  await app.listen(process.env.PORT || 8080, () => {
    new Logger().log(`API is started on PORT ${process.env.PORT || 8080}...`);
  });
}
bootstrap();
