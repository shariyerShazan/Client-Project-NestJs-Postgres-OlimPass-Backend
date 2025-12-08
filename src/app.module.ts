import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegisterService } from './register/register.service';
import { RegisterModule } from './register/register.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook/webhook.controller';


@Module({
  imports: [PrismaModule, RegisterModule ,
    ConfigModule.forRoot({
        isGlobal: true
     })
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, PrismaService, RegisterService],
})
export class AppModule {}
