import { Module } from '@nestjs/common';
import { AmountsModule } from './../../amounts/amounts.module';
import { CallbackPyramidParser } from './callback.pyramid.parser';
import { ConstantsModule } from './../../constants/constants.module';
import { CurrencyRateModule } from './../../currency-rate/currency-rate.module';
import { NosicaModule } from '../nosica/nosica.module';
import { ServicesModule } from './../../../modules/services/services.module';
import { SubservicesModule } from './../../../modules/subservices/subservices.module';
import { PeriodsModule } from './../../../modules/periods/periods.module';
import { PyramidParser } from './pyramid.parser';
import { PricesModule } from './../../prices/prices.module';
import { WorkloadsModule } from './../../../modules/workloads/workloads.module';
import { ThirdpartiesModule } from './../../../modules/thirdparties/thirdparties.module';
import { PortfolioModule } from './../../portfolio/portfolio.module';
import { SubsidiaryallocationModule } from './../../subsidiaryallocation/subsidiaryallocation.module';
import { SubtypologiesModule } from './../../subtypologies/subtypologies.module';
import { SubnatureModule } from './../../subnature/subnature.module';

@Module({
  imports: [
    AmountsModule,
    ConstantsModule,
    CurrencyRateModule,
    PeriodsModule,
    PortfolioModule,
    PricesModule,
    NosicaModule,
    ThirdpartiesModule,
    ServicesModule,
    SubsidiaryallocationModule,
    SubtypologiesModule,
    SubservicesModule,
    SubnatureModule,
    WorkloadsModule,
  ],
  providers: [CallbackPyramidParser, PyramidParser],
  exports: [CallbackPyramidParser, PyramidParser],
})
export class PyramidModule {}
