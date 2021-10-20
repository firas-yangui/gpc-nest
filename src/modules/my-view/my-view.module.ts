import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditModule } from '../audit/audit.module';
import { MyViewRepository } from './my-view.repository';
import { MyViewController } from './my-view.controller';
import { MyViewService } from './my-view.service';

@Module({
  imports: [TypeOrmModule.forFeature([MyViewRepository]), AuditModule],
  controllers: [MyViewController],
  providers: [MyViewService],
  exports: [MyViewService],
})
export class MyViewModule {}
