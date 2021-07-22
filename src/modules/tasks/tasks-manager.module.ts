import { Module } from '@nestjs/common';
import { TasksService } from './tasks-manager.service';
import { NosicaModule } from './nosica/nosica.module';
import { PyramidModule } from './pyramid/pyramid.module';
import { MyGTSModule } from './mgts/mygts.module';
import { LicenceMaintenanceModule } from './licence_maintenance/licence_maintenance.module';
import { ConstantsModule } from '../constants/constants.module';
import { AmountsModule } from '../amounts/amounts.module';
import { RawAmountsModule } from '../rawamounts/rawamounts.module';
import { ImportRejectionsHandlerModule } from '../import-rejections-handler/import-rejections-handler.module';
@Module({
  imports: [
    NosicaModule,
    MyGTSModule,
    PyramidModule,
    LicenceMaintenanceModule,
    AmountsModule,
    RawAmountsModule,
    ConstantsModule,
    ImportRejectionsHandlerModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
