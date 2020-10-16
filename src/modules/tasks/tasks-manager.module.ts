import { Module } from '@nestjs/common';
import { TasksService } from './tasks-manager.service';
import { TasksSchedulerService } from './tasks-scheduler.service';
import { NosicaModule } from './nosica/nosica.module';
import { PyramidModule } from './pyramid/pyramid.module';
import { AmqplibWrapper } from './../amqplibWrapper/amqplib-wrapper.module';
import { ConfigService } from './../../config/rabbitmq-config.service';
import { ConstantsModule } from '../constants/constants.module';
import { AmountsModule } from '../amounts/amounts.module';
import { RawAmountsModule } from '../rawamounts/rawamounts.module';
@Module({
  imports: [NosicaModule, PyramidModule, AmountsModule, RawAmountsModule, AmqplibWrapper.registerAsync({ useClass: ConfigService }), ConstantsModule],
  providers: [TasksService, TasksSchedulerService],
  exports: [TasksService, TasksSchedulerService],
})
export class TasksModule {}
