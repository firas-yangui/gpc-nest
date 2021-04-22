import moment = require('moment');
import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isNull, isUndefined } from 'lodash';
import { getConnection } from 'typeorm';
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
import { SubsidiaryAllocation } from '../subsidiaryallocation/subsidiaryallocation.entity';

@Injectable()
export class AmountStatsService {
  constructor(
    @InjectRepository(AmountStatRepository)
    private amountStatRepository: AmountStatRepository,
    private readonly thirdpartiesService: ThirdpartiesService,
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
    try {
      const { serviceId, subserviceId, organizationId, partnerId, subnatureId } = filters;
      const year = moment().format('YYYY');

      const query = getConnection()
        .createQueryBuilder()
        .addFrom(AmountStat, 'amount_stat')
        .addFrom(SubsidiaryAllocation, 'partner')
        .select('amount_stat.periodType', 'type')
        .addSelect('SUM(amount_stat.mandays)', 'mandays')
        .addSelect('SUM(amount_stat.keuros)', 'keuros')
        .addSelect('SUM(amount_stat.keurossales)', 'keurossales')
        .addSelect('SUM(amount_stat.klocalcurrency)', 'klocalcurrency');

      query
        .where('amount_stat.thirdpartyid IN (:...thirdparties)', { thirdparties: thirdparties })
        .andWhere('amount_stat.businessType = :businessPlan', { businessPlan: businessPlan })
        .andWhere('amount_stat.month = :month', { month: month })
        .andWhere('amount_stat.year = :year', { year: year });

      if (!isNull(serviceId) && !isUndefined(serviceId)) query.andWhere('amount_stat.serviceid = :serviceId', { serviceId: serviceId });
      if (!isNull(subserviceId) && !isUndefined(subserviceId))
        query.andWhere('amount_stat.subserviceid = :subserviceId', { subserviceId: subserviceId });
      if (!isNull(organizationId) && !isUndefined(organizationId))
        query.andWhere('amount_stat.thirdpartyId = :organizationId', { organizationId: organizationId });
      if (!isNull(subnatureId) && !isUndefined(subnatureId)) query.andWhere('amount_stat.subnatureId = :subnatureId', { subnatureId: subnatureId });
      if (!isNull(partnerId) && !isUndefined(partnerId)) {
        query.andWhere('partner.id = :partnerId', { partnerId: partnerId });
        query.andWhere('amount_stat.workloadid = partner.workloadid');
      }

      return await query.groupBy('amount_stat.periodType').execute();
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }
}
