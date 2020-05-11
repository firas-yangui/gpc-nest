import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { NosicaModule } from './nosica/nosica.module';
import { PyramidModule } from './pyramid/pyramid.module';

@Module({
  imports: [NosicaModule, PyramidModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
