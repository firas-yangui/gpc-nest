import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubsidiaryallocationController } from './subsidiaryallocation.controller';
import { SubsidiaryallocationService } from './subsidiaryallocation.service';
import { SubsidiaryAllocation } from './subsidiaryallocation.entity';
import { AuditModule } from '../audit/audit.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubsidiaryAllocation]), AuditModule],
  controllers: [SubsidiaryallocationController],
  providers: [SubsidiaryallocationService],
  exports: [SubsidiaryallocationService],
})
export class SubsidiaryallocationModule {}
