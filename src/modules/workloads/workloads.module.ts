import { Module } from '@nestjs/common';
import { WorkloadsController } from './workloads.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { WorkloadsService } from './workloads.service';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesModule } from './../thirdparties/thirdparties.module';

@Module({
  imports: [TypeOrmModule.forFeature([WorkloadRepository]), ThirdpartiesModule],
  controllers: [WorkloadsController],
  providers: [WorkloadsService],
})
export class WorkloadsModule {}
