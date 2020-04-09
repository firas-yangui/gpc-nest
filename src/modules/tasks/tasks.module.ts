import { Module } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { NosicaModule } from './nosica/nosica.module';

@Module({
  imports: [NosicaModule],
  providers: [TasksService],
  exports: [TasksService],
})
export class TasksModule {}
