import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, 
      transform: true,
    }),
  );
  app.use(
    '/webhook',
    bodyParser.raw({ type: 'application/json' }),
  );
  await app.listen(process.env.PORT ?? 3333);
}
bootstrap();
