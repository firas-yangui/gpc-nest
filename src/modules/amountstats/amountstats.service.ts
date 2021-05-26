import moment = require('moment');
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNull, isUndefined } from 'lodash';
import { getManager } from 'typeorm';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { AmountStat } from './amountstat.entity';
import { AmountStatRepository } from './amountstats.repository';
import {
  BusinessPlanAmount,
  MonthlyBusinessPlanAmount,
  PeriodTypeAmount,
  SumAmountByPeriodTypeAndBusinessPlan,
} from '../interfaces/common-interfaces';
import * as _ from 'lodash';
import { PeriodsService } from '../periods/periods.service';

@Injectable()
export class AmountStatsService {
  constructor(
    @InjectRepository(AmountStatRepository)
    private amountStatRepository: AmountStatRepository,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly periodsService: PeriodsService,
  ) {}

  async getFilteredTotalAmounts(query: { [key: string]: number }, thirdpartyRootId: number) {
    const myThirdpartyRoot = await this.thirdpartiesService.getThirdPartyById(thirdpartyRootId);
    const thirdparties: Thirdparty[] = await this.thirdpartiesService.find({});
    this.thirdpartiesService.buildTree(thirdparties, myThirdpartyRoot);
    const thirdpartyChilds = this.thirdpartiesService.getMyThirdPartiesChilds();

    return await this.getTotalAmountsByMonth(query, thirdpartyChilds);
  }

  async getTotalAmountsByMonth(filters: { [key: string]: number }, thirdparties: Array<number>): Promise<MonthlyBusinessPlanAmount[]> {
    const promises = moment.months().map(async month => {
      const shortMonth = moment(month, 'MMMM').format('MM');
      return { month: shortMonth, plans: await this.getBusinessPlanMonthlyTotalAmounts(shortMonth, filters, thirdparties) };
    });

    return await Promise.all(promises);
  }

  async getBusinessPlanMonthlyTotalAmounts(
    month: string | null = null,
    filters: { [key: string]: number },
    thirdparties: Array<number>,
  ): Promise<BusinessPlanAmount> {
    return {
      RTB: await this.getPeriodTypeMonthlyAmount(month, filters, 'RTB', thirdparties),
      CTB: await this.getPeriodTypeMonthlyAmount(month, filters, 'CTB', thirdparties),
    };
  }

  async getPeriodTypeMonthlyAmount(
    month: string | null = null,
    filters: { [key: string]: number },
    businessPlan: string,
    thirdparties: Array<number>,
  ): Promise<PeriodTypeAmount> {
    const currentMonth = moment().format('MM');
    if (month <= currentMonth) {
      const totals = await this.getRawMonthlyTotalAmountGroupedByPeriodType(month, filters, businessPlan, thirdparties);
      const periodTypeAmount: PeriodTypeAmount = {};
      _.map(totals, total => {
        const { type, ...units } = total;
        periodTypeAmount[type] = units;
      });

      return periodTypeAmount;
    } else {
      return {};
    }
  }

  async getRawMonthlyTotalAmountGroupedByPeriodType(
    month: string | null = null,
    filters: { [key: string]: number },
    businessPlan: string,
    thirdparties: number[],
  ): Promise<SumAmountByPeriodTypeAndBusinessPlan[]> {
    const manager = getManager();
    try {
      // Extracting filters
      const { serviceId, subserviceId, organizationId, partnerId, subnatureId } = filters;

      // Getting periods Ids for selected month and year (arguments)
      const periods = await this.periodsService.getPeriodsByYearAndMonth(null, month);
      const periodIds = _.map(periods, 'id');

      const query = manager
        .createQueryBuilder()
        .from(AmountStat, 'amountstats')
        .select('amountstats.period_type', 'type')
        .addSelect('SUM(NULLIF(amountstats.mandays, 0))', 'mandays')
        .addSelect('SUM(NULLIF(amountstats.keuros, 0))', 'keuros')
        .addSelect('SUM(NULLIF(amountstats.keurossales, 0))', 'keurossales')
        .addSelect('SUM(NULLIF(amountstats.klocalcurrency, 0))', 'klocalcurrency')

        .where('amountstats.thirdpartyId IN (:...thirdparties)', { thirdparties: thirdparties })
        .andWhere('amountstats.businessType = :businessPlan', { businessPlan: businessPlan })
        .andWhere('amountstats.periodId IN (:...periodIds)', { periodIds: periodIds });

      if (!isNull(serviceId) && !isUndefined(serviceId)) query.andWhere('serviceId = :serviceId', { serviceId: serviceId });
      if (!isNull(subserviceId) && !isUndefined(subserviceId)) query.andWhere('subserviceId = :subserviceId', { subserviceId: subserviceId });
      if (!isNull(organizationId) && !isUndefined(organizationId))
        query.andWhere('thirdpartyId = :organizationId', { organizationId: organizationId });
      if (!isNull(subnatureId) && !isUndefined(subnatureId)) query.andWhere('subnatureId = :subnatureId', { subnatureId: subnatureId });
      // if (!isNull(partnerId) && !isUndefined(partnerId)) query.andWhere('partners.thirdpartyid = :partnerId', { partnerId: partnerId });

      return await query.groupBy('amountstats.period_type').execute();
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }

  async getAmount(query: { periodId: number; thirdpartyId?: number; serviceId?: number; subserviceId?: number; workloadId?: number }) {
    const manager = getManager();

    try {
      const dbQuery = manager
        .createQueryBuilder()
        .from(AmountStat, 'amountstats')
        .select('SUM(NULLIF(amountstats.mandays, 0))', 'mandays')
        .addSelect('SUM(NULLIF(amountstats.keuros, 0))', 'keuros')
        .addSelect('SUM(NULLIF(amountstats.keurossales, 0))', 'keurossales')
        .addSelect('SUM(NULLIF(amountstats.klocalcurrency, 0))', 'klocalcurrency')
        .where('amountstats.periodId = :periodId', { periodId: query.periodId });

      if (!isNull(query.thirdpartyId) && !isUndefined(query.thirdpartyId))
        dbQuery.andWhere('amountstats.thirdpartyId = :thirdpartyId', { thirdpartyId: query.thirdpartyId });

      if (!isNull(query.serviceId) && !isUndefined(query.serviceId))
        dbQuery.andWhere('amountstats.serviceId = :serviceId', { serviceId: query.serviceId });

      if (!isNull(query.subserviceId) && !isUndefined(query.subserviceId))
        dbQuery.andWhere('amountstats.subserviceId = :subserviceId', { subserviceId: query.subserviceId });

      if (!isNull(query.workloadId) && !isUndefined(query.workloadId))
        dbQuery.andWhere('amountstats.workloadId = :workloadId', { workloadId: query.workloadId });

      return dbQuery.execute();
    } catch (error) {
      Logger.error(error);
    }
  }
}
