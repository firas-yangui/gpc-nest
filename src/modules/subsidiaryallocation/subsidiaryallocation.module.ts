import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubsidiaryallocationController } from './subsidiaryallocation.controller';
import { SubsidiaryallocationService } from './subsidiaryallocation.service';
import { SubsidiaryAllocation } from './subsidiaryallocation.entity';

@Module({
  imports: [TypeOrmModule.forFeature([SubsidiaryAllocation])],
  controllers: [SubsidiaryallocationController],
  providers: [SubsidiaryallocationService],
  exports: [SubsidiaryallocationService],
})
export class SubsidiaryallocationModule {}
