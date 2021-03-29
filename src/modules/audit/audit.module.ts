import { Module } from '@nestjs/common';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuditController } from './audit.controller';
import { AuditRepository } from './audit.repository';
import { AuditService } from './audit.service';
import { AllExceptionsFilter } from './../exceptions-handler/all-exceptions.filter';

@Module({
  imports: [TypeOrmModule.forFeature([AuditRepository])],
  controllers: [AuditController],
  providers: [
    AuditService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],

  exports: [],
})
export class AuditModule {}
