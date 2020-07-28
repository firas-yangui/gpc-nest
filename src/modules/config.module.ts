import { Global, Module } from '@nestjs/common';
import { SubservicesModule } from './subservices/subservices/subservices.module';
import { SubnatureappsettingsModule } from './subnatureappsettings/subnatureappsettings.module';
import { ServicesModule } from './services/services.module';
import { PricesModule } from './prices/prices.module';
import { CurrencyRateModule } from './currency-rate/currency-rate.module';
import ConfigService from './../services/config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`/${__dirname}/../../env/${process.env.NODE_ENV || 'development'}.env`),
    },
  ],
  exports: [ConfigService],
  imports: [SubservicesModule, SubnatureappsettingsModule, ServicesModule, PricesModule, CurrencyRateModule],
})
export default class ConfigModule {}
