import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { ConstantsModule } from '../constants/constants.module';
import { AmountsModule } from '../amounts/amounts.module';
import { RawAmountsModule } from '../rawamounts/rawamounts.module';
@Module({
  imports: [AmountsModule, RawAmountsModule, ConstantsModule],
  providers: [SchedulerService],
  exports: [SchedulerService],
})
export class SchedulerModule {}
