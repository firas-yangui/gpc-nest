import { Module } from '@nestjs/common';
import { CurrencyRateController } from './currency-rate.controller';
import { CurrencyRateService } from './currency-rate.service';
import { CurrencyRateRepository } from './currency-rate.repository';
import { ThirdpartiesModule } from './../thirdparties/thirdparties.module';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CurrencyRateRepository]), ThirdpartiesModule],
  controllers: [CurrencyRateController],
  providers: [CurrencyRateService],
  exports: [CurrencyRateService],
})
export class CurrencyRateModule {}
