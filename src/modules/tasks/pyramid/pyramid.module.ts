import { Module } from '@nestjs/common';
import { AmountsModule } from './../../amounts/amounts.module';
import { RawAmountsModule } from './../../rawamounts/rawamounts.module';
import { PyramidService } from './pyramid.service';
import { ConstantsModule } from './../../constants/constants.module';
import { CurrencyRateModule } from './../../currency-rate/currency-rate.module';
import { NosicaModule } from '../nosica/nosica.module';
import { ServicesModule } from './../../../modules/services/services.module';
import { SubservicesModule } from './../../../modules/subservices/subservices.module';
import { PeriodsModule } from './../../../modules/periods/periods.module';
import { PricesModule } from './../../prices/prices.module';
import { WorkloadsModule } from './../../../modules/workloads/workloads.module';
import { ThirdpartiesModule } from './../../../modules/thirdparties/thirdparties.module';
import { PortfolioModule } from './../../portfolio/portfolio.module';
import { SubsidiaryallocationModule } from './../../subsidiaryallocation/subsidiaryallocation.module';
import { SubtypologiesModule } from './../../subtypologies/subtypologies.module';
import { SubtypologyAppSettingsModule } from './../../subTypologyAppSettings/subtypologyappsettings.module';
import { SubnatureModule } from './../../subnature/subnature.module';
import { DatalakeMappingModule } from '../../datalakemapping/datalakemapping.module';
import { ImportMappingModule } from '../../importmapping/importmapping.module';
import { ActivitycapayorModule } from '../../activity-capayor/activity-capayor.module';
import { ActivitModule } from '../../activity/activity.module';
import { CaPayorModule } from '../../capayor/capayor.module';
@Module({
  imports: [
    AmountsModule,
    ConstantsModule,
    CurrencyRateModule,
    PeriodsModule,
    PortfolioModule,
    PricesModule,
    NosicaModule,
    RawAmountsModule,
    ThirdpartiesModule,
    ServicesModule,
    SubsidiaryallocationModule,
    SubtypologiesModule,
    SubtypologyAppSettingsModule,
    SubservicesModule,
    SubnatureModule,
    WorkloadsModule,
    DatalakeMappingModule,
    ImportMappingModule,
    ActivitycapayorModule,
    ActivitModule,
    CaPayorModule,
  ],
  providers: [PyramidService],
  exports: [PyramidService],
})
export class PyramidModule {}
