import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegisterService } from './register/register.service';
import { RegisterModule } from './register/register.module';
import { ConfigModule } from '@nestjs/config';
import { WebhookController } from './webhook/webhook.controller';
import { RedeemModule } from './redeem/redeem.module';
import { MailService } from './mail/mail.service';
import { ScheduleModule } from '@nestjs/schedule';
import { ExpireRegisterService } from './expire-register/expire-register.service';




@Module({
  imports: [PrismaModule, RegisterModule ,
    ConfigModule.forRoot({
        isGlobal: true
     }),
    RedeemModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController, WebhookController],
  providers: [AppService, PrismaService, RegisterService, MailService, ExpireRegisterService],
})
export class AppModule {}
