import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubsidiaryallocationController } from './subsidiaryallocation.controller';
import { SubsidiaryallocationService } from './subsidiaryallocation.service';
import { SubsidiaryAllocation } from './subsidiaryallocation.entity';
import { AuditService } from '../audit/audit.service';
import { UserService } from '../user/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([SubsidiaryAllocation]), AuditService, UserService],
  controllers: [SubsidiaryallocationController],
  providers: [SubsidiaryallocationService],
  exports: [SubsidiaryallocationService],
})
export class SubsidiaryallocationModule {}
