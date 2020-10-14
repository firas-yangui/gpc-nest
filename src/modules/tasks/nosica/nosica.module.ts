import { Module } from '@nestjs/common';

import { CallbackNosicaParser } from './callback.nosica.parser';
import { NosicaParser } from './nosica.parser';
import { ResourceManager } from './resource-store';

import { ServicesModule } from './../../../modules/services/services.module';
import { SubservicesModule } from './../../../modules/subservices/subservices.module';
import { SubnatureappsettingsModule } from './../../../modules/subnatureappsettings/subnatureappsettings.module';
import { AmountsModule } from './../../../modules/amounts/amounts.module';
import { RawAmountsModule } from './../../../modules/rawamounts/rawamounts.module';
import { PeriodsModule } from './../../../modules/periods/periods.module';
import { WorkloadsModule } from './../../../modules/workloads/workloads.module';
import { ThirdpartiesModule } from './../../../modules/thirdparties/thirdparties.module';
import { ConstantsModule } from './../../constants/constants.module';
import { CurrencyRateModule } from './../../currency-rate/currency-rate.module';
import { PricesModule } from './../../prices/prices.module';

@Module({
  imports: [
    AmountsModule,
    RawAmountsModule,
    ConstantsModule,
    CurrencyRateModule,
    PeriodsModule,
    PricesModule,
    ThirdpartiesModule,
    ServicesModule,
    SubservicesModule,
    SubnatureappsettingsModule,
    WorkloadsModule,
  ],
  providers: [ResourceManager, NosicaParser, CallbackNosicaParser],
  exports: [ResourceManager, NosicaParser, CallbackNosicaParser],
})
export class NosicaModule {}
