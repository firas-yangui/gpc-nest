import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';
import { PeriodRepository } from './period.repository';

@Module({
  imports: [TypeOrmModule.forFeature([PeriodRepository])],
  controllers: [PeriodsController],
  providers: [PeriodsService],
})
export class PeriodsModule {}
