import { Module } from '@nestjs/common';
import { TasksService } from './tasks-manager.service';
import { NosicaModule } from './nosica/nosica.module';
import { PyramidModule } from './pyramid/pyramid.module';
import { MyGTSModule } from './mgts/mygts.module';
import { ConstantsModule } from '../constants/constants.module';
import { AmountsModule } from '../amounts/amounts.module';
import { RawAmountsModule } from '../rawamounts/rawamounts.module';
@Module({
  imports: [
    NosicaModule,
    MyGTSModule,
    PyramidModule,
    AmountsModule,
    RawAmountsModule,
    ConstantsModule,
  ],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
