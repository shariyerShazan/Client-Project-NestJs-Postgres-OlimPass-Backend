import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { PrismaModule } from './prisma/prisma.module';
import { RegisterService } from './register/register.service';
import { RegisterModule } from './register/register.module';


@Module({
  imports: [PrismaModule, RegisterModule],
  controllers: [AppController],
  providers: [AppService, PrismaService, RegisterService],
})
export class AppModule {}
