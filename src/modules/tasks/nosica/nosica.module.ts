import { Module } from '@nestjs/common';

import { CallbackNosicaParser } from './../../../modules/tasks/nosica/callback.nosica.parser';
import { CsvParser } from './../../../modules/tasks/nosica/csv.parser';

import { ServicesModule } from './../../../modules/services/services.module';
import { SubservicesModule } from './../../../modules/subservices/subservices.module';
import { SubnatureappsettingsModule } from './../../../modules/subnatureappsettings/subnatureappsettings.module';
import { AmountsModule } from './../../../modules/amounts/amounts.module';
import { PeriodsModule } from './../../../modules/periods/periods.module';
import { WorkloadsModule } from './../../../modules/workloads/workloads.module';
import { ThirdpartiesModule } from './../../../modules/thirdparties/thirdparties.module';

@Module({
  imports: [AmountsModule, PeriodsModule, ThirdpartiesModule, ServicesModule, SubservicesModule, SubnatureappsettingsModule, WorkloadsModule],
  providers: [CsvParser, CallbackNosicaParser],
  exports: [CsvParser, CallbackNosicaParser],
})
export class NosicaModule {}
