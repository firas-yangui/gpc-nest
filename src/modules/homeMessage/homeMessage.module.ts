import { Module } from '@nestjs/common';
import { HomeMessageController } from './homeMessage.controller';
import { HomeMessageService } from './homeMessage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeMessageRepository } from './homeMessage.repository';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([HomeMessageRepository]), UserModule],
  controllers: [HomeMessageController],
  providers: [HomeMessageService],
  exports: [HomeMessageService],
})
export class HomeMessageModule {}
