import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesService } from './../thirdparties/thirdparties.service';
import { PeriodsService } from './../periods/periods.service';
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
import { getManager, Like } from 'typeorm';
import { Workload } from './workload.entity';
import { SubservicesService } from './../subservices/subservices.service';
import { ServicesService } from './../services/services.service';
import { AmountStat } from '../amountstats/amountstat.entity';
import { isNull, isUndefined } from 'lodash';
import { WorkloadTreeDataItem } from './interface/workload-tree-data-item.interface';
import { assertOnlyNumbers } from '../../utils/utils';
import {SynthesisFilterDto} from "./dto/synthesis-filter.dto";

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
    const thirdparties: ThirdpartyInterface[] = await this.thirdpartiesService.find({});
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

  async generateCode(prefix: string = null) {
    const workload = await this.workloadRepository.findOne({
      order: { id: 'DESC' },
    });
    if (!prefix) prefix = 'Z';
    return `${prefix}_${workload.id + 1}`;
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
    const currentMonth = moment().format('MM');
    if (month <= currentMonth) {
      const totals = await this.getRawMonthlyTotalAmountGroupedByPeriodType(month, body, businessPlan, thirdparties);
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
    body: any,
    businessPlan: string,
    thirdparties: number[],
  ): Promise<SumAmountByPeriodTypeAndBusinessPlan[]> {
    try {
      const periods = await this.periodsService.getPeriodsByYearAndMonth(null, month);
      const periodIds = _.map(periods, 'id');

      Logger.log('Period Ids length : ' + periodIds.length, 'Native query');

      const { serviceId, subserviceId, organizationId, partnerId, subnatureId } = body;

      /**
       * @todo add relation with appSettings for connected user
       */

      const query = getManager()
        .createQueryBuilder()
        .from(AmountStat, 'amountStats')
        .select('period_type')
        .addSelect('SUM(amount.mandays)', 'mandays')
        .addSelect('SUM(amount.keuros)', 'keuros')
        .addSelect('SUM(amount.keurossales)', 'keurossales')
        .addSelect('SUM(amount.klocalcurrency)', 'klocalcurrency')

        .where('thirdpartyid IN (:...thirdparties)', { thirdparties: thirdparties })
        .andWhere('subtypology.businesstype = :businessPlan', { businessPlan: businessPlan })
        .andWhere('amount.periodid IN (:...periodIds)', { periodIds: periodIds });

      if (!isNull(serviceId) && !isUndefined(serviceId)) query.andWhere('service.id = :serviceId', { serviceId: serviceId });
      if (!isNull(subserviceId) && !isUndefined(subserviceId)) query.andWhere('subserviceid = :subserviceId', { subserviceId: subserviceId });
      if (!isNull(organizationId) && !isUndefined(organizationId))
        query.andWhere('thirdpartyid = :organizationId', { organizationId: organizationId });
      if (!isNull(subnatureId) && !isUndefined(subnatureId)) query.andWhere('subnatureid = :subnatureId', { subnatureId: subnatureId });
      // if (!isNull(partnerId) && !isUndefined(partnerId)) query.andWhere('partners.thirdpartyid = :partnerId', { partnerId: partnerId });

      return await query.groupBy('period_type').execute();
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }

  async getWorkloadsWithAmounts(options: { subserviceId: number; periodId: number }): Promise<any> {
    try {
      const query = getManager()
        .createQueryBuilder()
        .from(AmountStat, 'amount')
        .select('amount.workloadId', 'workloadId')
        .addSelect('amount.periodId', 'periodId')
        .addSelect('SUM(amount.mandays)', 'mandays')
        .addSelect('SUM(amount.keuros)', 'keuros')
        .addSelect('SUM(amount.keurossales)', 'keurossales')
        .addSelect('SUM(amount.klocalcurrency)', 'klocalcurrency')

        .where('amount.periodid = :periodId', { periodId: +options.periodId })
        .andWhere('amount.subserviceid = :serviceId', { serviceId: +options.subserviceId });

      query.groupBy('amount.workloadId').addGroupBy('amount.periodId');

      return await query.getRawMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  getWorkloadSubQuery(filter: SynthesisFilterDto) {
    let subquery = `
    select
           stas.id as stasId,
           stas.plan as stasPlanName,
           
           ss.id  as subserviceId,
           ss.name  as subserviceName,
           ss.code  as subserviceCode,
           
           sn.name  as subnatureName,
           sn.id    as subnatureId,
           
           srv.name as serviceName,
           srv.id as serviceId,
           
           w.code   as workloadCode,
           w.status as workloadStatus,
           w.id as workloadId    
    from subservice ss
             left outer JOIN service srv on ss.serviceid = srv.id
             left outer join workload w on w.subserviceid = ss.id
             left outer join portfolio p on p.id = ss.portfolioid
             left outer join subtypology st on ss.subtypologyid = st.id
             left outer join subtypologyappsettings stas on st.id = stas.modelid
             left outer join subnature sn on w.subnatureid = sn.id
    where 1 = 1 `;

    if (filter.portfolios && filter.portfolios.length > 0) {
      assertOnlyNumbers(filter.portfolios);
      subquery += ` AND p.id in (${filter.portfolios.join(',')}) `;
    }
    if (filter.code && filter.code.length > 0) {
      //assertOnlyNumbers(filter.portfolios);
      //To Do sql inject check for string
      subquery += ` AND w.code like (${filter.code} OR ss.`;
    }

    /*
    --       AND srv.name = 'Activités de RSC/DIR'
    --       AND ss.code = 'FASTENTRY'
    --          AND sts.plan = 'Code plan'
    --       AND ss.name = 'PLUG - RUN'
    --       AND w.code like 'Z14184%'SynthesisFilter
    --       AND sn.name = 'SG PARIS'
    */
    return subquery;
  }

  async getWorkloadPortofolioViewTreeDataWithFilter(
    columns: Array<keyof WorkloadTreeDataItem>,
    parentTreeNode: WorkloadTreeDataItem,
    syntheseFilter: SynthesisFilterDto,
  ) {
    //todo validate column names to prevent SQL Injection
    const entityManager = getManager();
    const subquery = this.getWorkloadSubQuery(syntheseFilter);
    let fullSQL = `
    with treeData as (${subquery}) SELECT distinct ${columns.join(',')}/*exemple :svrName, ssCode, ssName, plan*/ 
    from treeData t where 1=1 `;

    if (parentTreeNode!=null) {
      Object.keys(parentTreeNode).forEach(parentColumn => {
        const id = parentTreeNode[parentColumn];
        assertOnlyNumbers(id);
        fullSQL += ` AND ${parentColumn} = ${id}`;
      });
    }

    const result = entityManager.query(
      fullSQL,
      // [syntheseFilter],
    );
    return result;
  }
}
