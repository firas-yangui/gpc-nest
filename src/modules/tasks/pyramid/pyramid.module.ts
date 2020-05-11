import { Module } from '@nestjs/common';
import { CallbackPyramidParser } from './callback.pyramid.parser';
import { PyramidParser } from './pyramid.parser';

import { ServicesModule } from './../../../modules/services/services.module';
import { SubservicesModule } from './../../../modules/subservices/subservices.module';
import { PeriodsModule } from './../../../modules/periods/periods.module';
import { WorkloadsModule } from './../../../modules/workloads/workloads.module';
import { ThirdpartiesModule } from './../../../modules/thirdparties/thirdparties.module';

@Module({
  imports: [PeriodsModule, ThirdpartiesModule, ServicesModule, SubservicesModule, WorkloadsModule],
  providers: [CallbackPyramidParser, PyramidParser],
  exports: [CallbackPyramidParser, PyramidParser],
})
export class PyramidModule {}
