import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesService } from './../thirdparties/thirdparties.service';
import { PeriodsService } from './../periods/periods.service';
import { Request } from 'express';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import * as _ from 'lodash';
import * as moment from 'moment';

import {
  PeriodTypeAmount,
  BusinessPlanAmount,
  MonthlyBusinessPlanAmount,
  Thirdparty as ThirdpartyInterface,
  SumAmountByPeriodTypeAndBusinessPlan,
} from './../interfaces/common-interfaces';
import { getConnection, Like } from 'typeorm';
import { Workload } from './workload.entity';
import { SubservicesService } from './../subservices/subservices.service';

@Injectable()
export class WorkloadsService {
  constructor(
    @InjectRepository(WorkloadRepository)
    private workloadRepository: WorkloadRepository,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly subservicesService: SubservicesService,
    private readonly periodsService: PeriodsService,
  ) {}

  async getTotalByPeriodTypesAndBusinessPlan(req: Request, thirdpartyRootId: number): Promise<MonthlyBusinessPlanAmount[]> {
    const myThirdpartyRoot = await this.thirdpartiesService.getThirdPartyById(thirdpartyRootId);
    const thirdparties: ThirdpartyInterface[] = await this.thirdpartiesService.find();
    this.thirdpartiesService.buildTree(thirdparties, myThirdpartyRoot);
    const thirdpartyChilds = this.thirdpartiesService.getMyThirdPartiesChilds();

    return await this.getTotalAmountsByMonth(thirdpartyChilds);
  }

  async getTotalAmountsByMonth(thirdparties: Array<number>): Promise<MonthlyBusinessPlanAmount[]> {
    const promises = moment.months().map(async month => {
      const shortMonth = moment(month, 'MMMM').format('MM');
      return { month: shortMonth, plans: await this.getBusinessPlanMonthlyTotalAmounts(shortMonth, thirdparties) };
    });

    return await Promise.all(promises);
  }

  async getBusinessPlanMonthlyTotalAmounts(month: string | null = null, thirdparties: number[]): Promise<BusinessPlanAmount> {
    return {
      RTB: await this.getPeriodTypeMonthlyAmount(month, thirdparties, 'RTB'),
      CTB: await this.getPeriodTypeMonthlyAmount(month, thirdparties, 'CTB'),
    };
  }

  async find(options: object = {}): Promise<Workload[]> {
    return await this.workloadRepository.find(options);
  }

  async getNosicaWorkloadInSubserviceName(subserviceName: string) {
    const subService = await this.subservicesService.findOne(null, { name: Like(subserviceName) });
    if (!subService) {
      Logger.error(`subService not found by subServiceName: ${subserviceName}`);
      return;
    }
    return await this.find({ code: Like('%NOS_TRANS%'), subservice: subService.id });
  }

  async update(criteria: any, partialEntity: any): Promise<UpdateResult> {
    return await this.workloadRepository.update(criteria, partialEntity);
  }

  async getPeriodTypeMonthlyAmount(month: string | null = null, thirdparties: number[], businessPlan: string): Promise<PeriodTypeAmount> {
    const totals = await this.getRawMonthlyTotalAmountGroupedByPeriodType(month, thirdparties, businessPlan);
    const periodTypeAmount: PeriodTypeAmount = {};
    _.map(totals, total => {
      const { type, ...units } = total;
      periodTypeAmount[type] = units;
    });

    return periodTypeAmount;
  }

  async getRawMonthlyTotalAmountGroupedByPeriodType(
    month: string | null = null,
    thirdparties: number[],
    businessPlan: string,
  ): Promise<SumAmountByPeriodTypeAndBusinessPlan[]> {
    try {
      const periods = await this.periodsService.getPeriodsByYearAndMonth(null, month);
      const periodIds = _.map(periods, 'id');
      /**
       * @todo add relation with appSettings for connected user
       */

      return await getConnection()
        .createQueryBuilder()
        .from(Workload, 'workload')
        .select('period.type', 'type')
        .addSelect('SUM(amount.mandays)', 'mandays')
        .addSelect('SUM(amount.keuros)', 'keuros')
        .addSelect('SUM(amount.keurossales)', 'keurossales')
        .addSelect('SUM(amount.klocalcurrency)', 'klocalcurrency')

        .leftJoin('workload.subservice', 'subservice')
        .leftJoin('subservice.subtypology', 'subtypology')
        .leftJoin('workload.amounts', 'amount')
        .leftJoin('amount.period', 'period')
        .where('workload.thirdpartyid IN (:...thirdparties)', { thirdparties: thirdparties })
        .andWhere('amount.periodid IN (:...periodIds)', { periodIds: periodIds })
        .andWhere('subtypology.businesstype = :businessPlan', { businessPlan: businessPlan })
        .groupBy('period.type')
        .execute();
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }
}
