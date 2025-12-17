import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

   app.enableCors({
    origin: ['http://localhost:3000', 'http://localhost:5173' , 'http://localhost:5174' , 'http://localhost:5175'], 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true, 
  });
  app.use(cookieParser());
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
