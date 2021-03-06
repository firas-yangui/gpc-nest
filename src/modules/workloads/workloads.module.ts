import { Module } from '@nestjs/common';
import { WorkloadsController } from './workloads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkloadsService } from './workloads.service';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesModule } from './../thirdparties/thirdparties.module';
import { PeriodsModule } from './../periods/periods.module';
import { ServicesModule } from './../services/services.module';
import { SubservicesModule } from './../subservices/subservices.module';
import { AuditModule } from '../audit/audit.module';
import { WorkloadExportService } from './workload.export.service';

@Module({
  imports: [TypeOrmModule.forFeature([WorkloadRepository]), ThirdpartiesModule, ServicesModule, SubservicesModule, PeriodsModule, AuditModule],
  controllers: [WorkloadsController],
  providers: [WorkloadsService, WorkloadExportService],
  exports: [WorkloadsService, WorkloadExportService],
})
export class WorkloadsModule {}
