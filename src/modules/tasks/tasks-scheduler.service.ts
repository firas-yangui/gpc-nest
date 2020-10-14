import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class TasksSchedulerService {
  private readonly logger = new Logger(TasksSchedulerService.name);

  @Cron(CronExpression.EVERY_10_SECONDS)
  handleFlowsDedupLinesCron() {
    this.logger.debug('Called every 10 seconds');
  }
}
