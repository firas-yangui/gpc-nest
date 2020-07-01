import { Module } from '@nestjs/common';
import { TasksService } from './tasks-manager.service';
import { NosicaModule } from './nosica/nosica.module';
import { PyramidModule } from './pyramid/pyramid.module';
import { AmqplibWrapper } from './../amqplibWrapper/amqplib-wrapper.module';
import { ConfigService } from './../../config/rabbitmq-config.service';
import { ConstantsModule } from '../constants/constants.module';

@Module({
  imports: [NosicaModule, PyramidModule, AmqplibWrapper.registerAsync({ useClass: ConfigService }), ConstantsModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
