import { Module } from '@nestjs/common';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';

@Module({
  controllers: [PeriodsController],
  providers: [PeriodsService],
})
export class PeriodsModule {}
