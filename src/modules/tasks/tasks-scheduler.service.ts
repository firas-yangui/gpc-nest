import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RawAmountsService } from '../rawamounts/rawamounts.service';
import { AmountsService } from '../amounts/amounts.service';
import { ConstantService } from '../constants/constants';
import { map } from 'lodash';

@Injectable()
export class TasksSchedulerService {
  private readonly logger = new Logger(TasksSchedulerService.name);
  constructor(private constantService: ConstantService, private rawAmountsService: RawAmountsService, private amountsService: AmountsService) {}

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleFlowsDedupLinesCron() {
    Logger.log('START cron to handle duplicates flows lines');
    const waitingFlows = await this.rawAmountsService.findWaitingFlows();
    if (!waitingFlows.length) {
      Logger.warn('No data found in raw amount table, nothing to synchronize');
      Logger.warn('Exit');
      return;
    }
    Logger.log('START synchronize data');

    map(waitingFlows, data => {
      this.amountsService.synchronizeFromRawAmounts(data.datasource);
    });
    Logger.log('END cron to handle duplicates flows lines');
  }
}
