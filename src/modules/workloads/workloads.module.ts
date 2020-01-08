import { Module } from '@nestjs/common';
import { WorkloadsController } from './workloads.controller';
import { WorkloadsService } from './workloads.service';

@Module({
  controllers: [WorkloadsController],
  providers: [WorkloadsService]
})
export class WorkloadsModule {}
