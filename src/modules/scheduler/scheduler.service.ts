import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { RawAmountsService } from '../rawamounts/rawamounts.service';
import { AmountsService } from '../amounts/amounts.service';
import { ConstantService } from '../constants/constants';
import { map } from 'lodash';
import { getConnection } from 'typeorm';

@Injectable()
export class SchedulerService {
  private readonly logger = new Logger(SchedulerService.name);
  constructor(private constantService: ConstantService, private rawAmountsService: RawAmountsService, private amountsService: AmountsService) {}

  @Cron(CronExpression.EVERY_15_MINUTES)
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

  @Cron(CronExpression.EVERY_DAY_AT_4AM, {
    name: 'Populating amount stats table',
    timeZone: 'Europe/Paris',
  })
  populateTable() {
    Logger.log('Populating amount stats table job started');
    getConnection()
      .createQueryRunner()
      .query(
        `
          DROP TABLE IF EXISTS amount_stats;

          SELECT
            ROW_NUMBER() over() as id,
            amount.workloadid as "workloadId",
            workload.thirdpartyid AS "thirdpartyId",
            subservice.serviceid AS "serviceId",
            workload.subserviceid AS "subserviceId",
            workload.subnatureid AS "subnatureId",
            period.id AS "periodId","
            period.type AS "period_type","
            period.month AS "month","
            period.year AS "year","
            subtypology.businesstype as "business_type","

            amount.mandays as "mandays",
            amount.keuros as "keuros",
            amount.keurossales as "keurossales",
            amount.klocalcurrency as "klocalcurrency"

          INTO amount_stats

          FROM amount

          -- Extract subserviceid, subnatureid and thirdpartyid
          INNER JOIN workload
          ON amount.workloadid = workload.id

          -- Extract subtypology id and service id
          INNER JOIN subservice
          ON workload.subserviceid = subservice.id

          -- Extract month and year and period type (actual, forecast, notified)
          INNER JOIN period
          ON amount.periodid = period.id

          -- Extract business type
          INNER JOIN subtypology
          ON subservice.subtypologyid = subtypology.id

          -- Only extract periods from january of the current year to the current month
          WHERE
            period.year = cast(date_part('year', now()) as text)
            AND period.month <= cast(date_part('month', now()) as text)
    ;
          `,
      )
      .then(() => Logger.log('Amount stats table job succeded'))
      .catch(err => Logger.error(err));
  }
}
