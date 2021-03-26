import { Module } from '@nestjs/common';
import { HomeMessageController } from './homeMessage.controller';
import { HomeMessageService } from './homeMessage.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HomeMessageRepository } from './homeMessage.repository';

@Module({
  imports: [TypeOrmModule.forFeature([HomeMessageRepository])],
  controllers: [HomeMessageController],
  providers: [HomeMessageService],
  exports: [HomeMessageService],
})
export class HomeMessageModule {}
