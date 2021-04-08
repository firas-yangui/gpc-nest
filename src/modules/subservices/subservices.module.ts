import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubservicesController } from './subservices.controller';
import { SubservicesService } from './subservices.service';
import { SubServiceRepository } from './subservices.repository';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubServiceRepository]), AuditModule],
  controllers: [SubservicesController],
  providers: [SubservicesService],
  exports: [SubservicesService],
})
export class SubservicesModule {}
