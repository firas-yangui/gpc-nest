import { Module } from '@nestjs/common';

import { CallbackNosicaParser } from './callback.nosica.parser';
import { NosicaParser } from './nosica.parser';

import { ServicesModule } from './../../../modules/services/services.module';
import { SubservicesModule } from './../../../modules/subservices/subservices.module';
import { SubnatureappsettingsModule } from './../../../modules/subnatureappsettings/subnatureappsettings.module';
import { AmountsModule } from './../../../modules/amounts/amounts.module';
import { PeriodsModule } from './../../../modules/periods/periods.module';
import { WorkloadsModule } from './../../../modules/workloads/workloads.module';
import { ThirdpartiesModule } from './../../../modules/thirdparties/thirdparties.module';
import { ConstantsModule } from './../../constants/constants.module';

@Module({
  imports: [
    AmountsModule,
    ConstantsModule,
    PeriodsModule,
    ThirdpartiesModule,
    ServicesModule,
    SubservicesModule,
    SubnatureappsettingsModule,
    WorkloadsModule,
  ],
  providers: [NosicaParser, CallbackNosicaParser],
  exports: [NosicaParser, CallbackNosicaParser],
})
export class NosicaModule {}
