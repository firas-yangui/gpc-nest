import { Module } from '@nestjs/common';
import { AmountStatsService } from './amountstats.service';
import { AmountstatsController } from './amountstats.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountStatRepository } from './amountstats.repository';
import { PeriodsModule } from '../periods/periods.module';
import { ThirdpartiesModule } from '../thirdparties/thirdparties.module';

@Module({
  imports: [TypeOrmModule.forFeature([AmountStatRepository]), ThirdpartiesModule, PeriodsModule],
  controllers: [AmountstatsController],
  providers: [AmountStatsService],
})
export class AmountStatsModule {}
