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
import { ServicesService } from './../services/services.service';
import { SubsidiaryAllocation } from '../subsidiaryallocation/subsidiaryallocation.entity';

@Injectable()
export class WorkloadsService {
  constructor(
    @InjectRepository(WorkloadRepository)
    private workloadRepository: WorkloadRepository,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly servicesService: ServicesService,
    private readonly subservicesService: SubservicesService,
    private readonly periodsService: PeriodsService,
  ) {}

  async getTotalByPeriodTypesAndBusinessPlan(body: { [key: string]: number }, thirdpartyRootId: number): Promise<MonthlyBusinessPlanAmount[]> {
    const myThirdpartyRoot = await this.thirdpartiesService.getThirdPartyById(thirdpartyRootId);
    const thirdparties: ThirdpartyInterface[] = await this.thirdpartiesService.find();
    this.thirdpartiesService.buildTree(thirdparties, myThirdpartyRoot);
    const thirdpartyChilds = this.thirdpartiesService.getMyThirdPartiesChilds();

    return await this.getTotalAmountsByMonth(body, thirdpartyChilds);
  }

  async getTotalAmountsByMonth(body: { [key: string]: number }, thirdparties: Array<number>): Promise<MonthlyBusinessPlanAmount[]> {
    const promises = moment.months().map(async month => {
      const shortMonth = moment(month, 'MMMM').format('MM');
      return { month: shortMonth, plans: await this.getBusinessPlanMonthlyTotalAmounts(shortMonth, body, thirdparties) };
    });

    return await Promise.all(promises);
  }

  async getBusinessPlanMonthlyTotalAmounts(
    month: string | null = null,
    body: { [key: string]: number },
    thirdparties: Array<number>,
  ): Promise<BusinessPlanAmount> {
    return {
      RTB: await this.getPeriodTypeMonthlyAmount(month, body, 'RTB', thirdparties),
      CTB: await this.getPeriodTypeMonthlyAmount(month, body, 'CTB', thirdparties),
    };
  }

  async find(options: object = {}): Promise<Workload[]> {
    return await this.workloadRepository.find(options);
  }

  async findOne(options: object = {}): Promise<Workload> {
    return await this.workloadRepository.findOne(options);
  }

  async save(workload): Promise<Workload> {
    return await this.workloadRepository.save(workload);
  }

  async generateCode() {
    const workload = await this.workloadRepository.findOne({
      order: { id: 'DESC' },
    });
    return `Z${workload.id + 1}`;
  }

  async getNosicaWorkloadInSubserviceName(subserviceName: string, thirdpartyId: number, subnatureId: number): Promise<Workload> {
    const service = await this.servicesService.findOne({ where: { name: Like(subserviceName) }, relations: ['subservices'] });
    if (!service) {
      Logger.error(`No service called "${subserviceName}" found in database`);
      return;
    }

    if (!service.subservices || service.subservices.length === 0) {
      Logger.error(`No sub-services found in the "${subserviceName}" service`);
      return;
    }

    const subServicesIds = _.map(service.subservices, 'id');
    return await this.findOne({
      relations: ['subservice', 'subnature', 'thirdparty'],
      where: {
        thirdparty: {
          id: thirdpartyId,
        },
        subnature: {
          id: subnatureId,
        },
        // subservice: {
        //   id: subServicesIds,
        // },
      },
    });
  }

  async update(criteria: any, partialEntity: any): Promise<UpdateResult> {
    return await this.workloadRepository.update(criteria, partialEntity);
  }

  async getPeriodTypeMonthlyAmount(
    month: string | null = null,
    body: { [key: string]: number },
    businessPlan: string,
    thirdparties: Array<number>,
  ): Promise<PeriodTypeAmount> {
    const totals = await this.getRawMonthlyTotalAmountGroupedByPeriodType(month, body, businessPlan, thirdparties);
    const periodTypeAmount: PeriodTypeAmount = {};
    _.map(totals, total => {
      const { type, ...units } = total;
      periodTypeAmount[type] = units;
    });

    return periodTypeAmount;
  }

  async getRawMonthlyTotalAmountGroupedByPeriodType(
    month: string | null = null,
    body: any,
    businessPlan: string,
    thirdparties: number[],
  ): Promise<SumAmountByPeriodTypeAndBusinessPlan[]> {
    try {
      const { serviceId, subserviceId, organizationId, partnerId, subnatureId } = body;

      const periods = await this.periodsService.getPeriodsByYearAndMonth(null, month);
      const periodIds = _.map(periods, 'id');
      /**
       * @todo add relation with appSettings for connected user
       */

      let query = getConnection()
        .createQueryBuilder()
        .from(Workload, 'workload')
        .select('period.type', 'type')
        .addSelect('SUM(amount.mandays)', 'mandays')
        .addSelect('SUM(amount.keuros)', 'keuros')
        .addSelect('SUM(amount.keurossales)', 'keurossales')
        .addSelect('SUM(amount.klocalcurrency)', 'klocalcurrency')

        .leftJoin('workload.subservice', 'subservice')
        .leftJoin('subservice.subtypology', 'subtypology')
        .leftJoin('subservice.service', 'service')
        .leftJoin('workload.subsidiaryAllocations', 'partners')
        .leftJoin('workload.subnature', 'subnature')
        .leftJoin('workload.amounts', 'amount')
        .leftJoin('amount.period', 'period')

        .where('workload.thirdpartyid IN (:...thirdparties)', { thirdparties: thirdparties })
        .andWhere('subtypology.businesstype = :businessPlan', { businessPlan: businessPlan })
        .andWhere('workload.periodid IN (:...periodIds)', { periodIds: periodIds })
        .andWhere('amount.periodid IN (:...periodIds)', { periodIds: periodIds });

      query = serviceId ? query.andWhere('service.id = :serviceId', { serviceId: serviceId }) : query;
      query = subserviceId ? query.andWhere('subservice.id = :subserviceId', { subserviceId: subserviceId }) : query;
      query = organizationId ? query.andWhere('workload.thirdpartyid = :organizationId', { organizationId: organizationId }) : query;
      query = partnerId ? query.andWhere('workload.subnatureid = :subnatureId', { subnatureId: subnatureId }) : query;
      query = subnatureId ? query.andWhere('partners.thirdpartyid = :partnerId', { partnerId: partnerId }) : query;

      return await query.groupBy('period.type').execute();
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }
}
