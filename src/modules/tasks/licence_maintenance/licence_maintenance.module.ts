import { Module } from '@nestjs/common';
import { AmountsModule } from '../../amounts/amounts.module';
import { RawAmountsModule } from '../../rawamounts/rawamounts.module';
import { LicenceMaintenanceService } from './licence_maintenance.service';
import { ConstantsModule } from '../../constants/constants.module';
import { CurrencyRateModule } from '../../currency-rate/currency-rate.module';
import { NosicaModule } from '../nosica/nosica.module';
import { ServicesModule } from '../../services/services.module';
import { SubservicesModule } from '../../subservices/subservices.module';
import { PeriodsModule } from '../../periods/periods.module';
import { PricesModule } from '../../prices/prices.module';
import { WorkloadsModule } from '../../workloads/workloads.module';
import { ThirdpartiesModule } from '../../thirdparties/thirdparties.module';
import { PortfolioModule } from '../../portfolio/portfolio.module';
import { SubsidiaryallocationModule } from '../../subsidiaryallocation/subsidiaryallocation.module';
import { SubtypologiesModule } from '../../subtypologies/subtypologies.module';
import { SubtypologyAppSettingsModule } from '../../subTypologyAppSettings/subtypologyappsettings.module';
import { SubnatureModule } from '../../subnature/subnature.module';
import { DatalakeMappingModule } from '../../datalakemapping/datalakemapping.module';
import { SubnatureappsettingsModule } from '../../subnatureappsettings/subnatureappsettings.module';
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
    SubnatureappsettingsModule,
  ],
  providers: [LicenceMaintenanceService],
  exports: [LicenceMaintenanceService],
})
export class LicenceMaintenanceModule {}
