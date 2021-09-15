import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesService } from './../thirdparties/thirdparties.service';
import { PeriodsService } from './../periods/periods.service';
import { UpdateResult } from 'typeorm/query-builder/result/UpdateResult';
import * as _ from 'lodash';
import { isNull, isUndefined } from 'lodash';
import * as moment from 'moment';

import {
  BusinessPlanAmount,
  MonthlyBusinessPlanAmount,
  PeriodTypeAmount,
  SumAmountByPeriodTypeAndBusinessPlan,
  Thirdparty as ThirdpartyInterface,
} from './../interfaces/common-interfaces';
import { getManager, Like } from 'typeorm';
import { Workload } from './workload.entity';
import { SubservicesService } from './../subservices/subservices.service';
import { ServicesService } from './../services/services.service';
import { AmountStat } from '../amountstats/amountstat.entity';
import { WorkloadTreeDataItemDTO } from './dto/workload-tree-data-item.dto';
import { assertOnlyNumbers, sqlEscape } from '../../utils/utils';
import { SynthesisFilterDTO } from './dto/synthesis-filter.dto';

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

  getWorkloadSubQuery(gpcAppSettingsId: number, filter: SynthesisFilterDTO, periodIds: number[]) {
    const asserNumber = num => (typeof num === 'number' ? num : 0); // sql injection protection
    const includePeriodFields = (periodIds: number[]) =>
      periodIds
        ? periodIds
            .map(
              (pId, i) => `
           , sum(a${i}.keurossales) as "keurossalesP${i}"
           , sum(a${i}.keuros) as "keurosP${i}"
           , sum(a${i}.klocalcurrency) as "klocalcurrencyP${i}"
           , sum(a${i}.mandays) as "mandaysP${i}"
        `,
            )
            .join('')
        : '';

    const includePeriodJoins = (periodIds: number[]) =>
      periodIds
        ? periodIds
            .map(
              (pId, i) => `
           left outer join amount a${i} on w.id = a${i}.workloadid and a${i}.periodid = ${asserNumber(pId)}
        `,
            )
            .join('')
        : '';

    const validProp = (prop: keyof WorkloadTreeDataItemDTO) => '"' + prop + '"';
    let subquery = `
    select
           stas.modelid as ${validProp('stasModelId')},
           stas.plan as ${validProp('stasPlanName')},
           
           ss.id  as ${validProp('ssId')},
           ss.name  as ${validProp('ssName')},
           ss.code  as ${validProp('ssCode')},
           
           sn.name  as ${validProp('snName')},
           sn.id    as ${validProp('snId')},
           
           srv.name as ${validProp('sName')},
           srv.id as ${validProp('sId')},
           srv.code as ${validProp('sCode')},
           srv.description as ${validProp('sDescr')},
           srv.lastupdatedate as ${validProp('sLastUpt')},
              
           w.code   as ${validProp('wlCode')},
           w.status as ${validProp('wlStatus')},
           w.description as ${validProp('wlDescription')},
           w.id as ${validProp('wlId')},
           
           ad.name as ${validProp('adName')},

           tp.id as ${validProp('tpId')},
           tp.trigram as ${validProp('tpTrigram')},

           dpt.id as ${validProp('dptId')},
           dpt.trigram as ${validProp('dptTrigram')}
           /*array_agg(partner.id) as "partnerIds",*/
           ${includePeriodFields(periodIds)}
    from subservice ss
             left outer join service srv on ss.serviceid = srv.id
             inner join workload w on w.subserviceid = ss.id
             left outer join portfolio p on p.id = ss.portfolioid
             left outer join subtypology st on ss.subtypologyid = st.id
             left outer join subtypologyappsettings stas on st.id = stas.modelid
             left outer join subnature sn on w.subnatureid = sn.id
             inner join serviceappsettings sas on srv.id = sas.modelid
             left outer join thirdparty tp on w.thirdpartyid = tp.id
             left outer join activitydomain ad on ad.id = sas.activitydomainid
             ${includePeriodJoins(periodIds)}
             left outer join subsidiaryallocation ssda on w.id = ssda.workloadid and ssda.periodid IN (${periodIds})
             left outer join thirdparty partner on partner.id = ssda.thirdpartyid
             left outer join thirdpartyappsettings partneras on partner.id = partneras.modelid
             left outer join thirdparty dpt on dpt.id=sas.thirdpartyid

    where sas.gpcappsettingsid = ${gpcAppSettingsId}
    `;
    //filter section
    if (filter && filter.portfolios && filter.portfolios.length > 0) {
      assertOnlyNumbers(filter.portfolios);
      subquery += ` AND srv.id in (${filter.portfolios.join(',')}) `;
    }
    if (filter && filter.code) {
      subquery += ` 
      AND (upper(w.code) like upper('%${sqlEscape(filter.code)}%') 
           OR upper(ss.code) like upper('%${sqlEscape(filter.code)}%') 
           OR upper(srv.name) like upper('%${sqlEscape(filter.code)}%') )
           `;
    }
    if (filter && filter.description) {
      subquery += ` 
      AND (upper(w.description) like upper('%${sqlEscape(filter.description)}%') 
           OR upper(ss.name) like upper('%${sqlEscape(filter.description)}%') )
           `;
    }
    if (filter && filter.plans && filter.plans.length > 0) {
      subquery += ` AND stas.modelid in (${filter.plans.join(',')}) `;
    }
    if (filter && filter.thirdparties && filter.thirdparties.length > 0) {
      subquery += ` AND tp.id in (${filter.thirdparties.join(',')}) `;
    }
    if (filter && filter.subnatures && filter.subnatures.length > 0) {
      subquery += ` AND sn.id in (${filter.subnatures.join(',')}) `;
    }
    if (filter && filter.domaine) {
      subquery += ` 
      AND upper(ad.name) like upper('%${sqlEscape(filter.domaine)}%')
           `;
    }
    if (filter && filter.partners && filter.partners.length > 0) {
      subquery += ` AND partner.id in (${filter.partners.join(',')}) `;
    }

    //end filter section
    subquery += `
        group by stas.modelid, stas.plan, ss.id, ss.name, ss.code, sn.name, sn.id, srv.name, srv.id, srv.code,srv.description,srv.lastupdatedate, ad.name, w.code, w.status, w.id, tp.id, tp.trigram, w.description, dpt.id, dpt.trigram`;

    return subquery;
  }

  async getWorkloadTreeDataWithFilter(
    gpcAppSettingsId: number,
    columns: Array<keyof WorkloadTreeDataItemDTO>,
    parentTreeNode: Partial<WorkloadTreeDataItemDTO>,
    syntheseFilter: SynthesisFilterDTO,
    periodIds: number[],
  ): Promise<WorkloadTreeDataItemDTO[]> {
    //todo validate column names to prevent SQL Injection
    const entityManager = getManager();
    const subquery = this.getWorkloadSubQuery(gpcAppSettingsId, syntheseFilter, periodIds);

    const quotedColumns: string[] = columns.map(c => '"' + c + '"');
    const periodSums: string[] = [];
    periodIds.forEach((pId, i) =>
      periodSums.push(
        `, SUM("keurossalesP${i}") as "keurossalesP${i}"`,
        `, SUM("keurosP${i}") as "keurosP${i}"`,
        `, SUM("klocalcurrencyP${i}") as "klocalcurrencyP${i}"`,
        `, SUM("mandaysP${i}") as "mandaysP${i}"`,
      ),
    );

    let fullSQL = `
    with treeData as (${subquery}) 
    SELECT  
                    ${quotedColumns.join(',')}
                    ${periodSums.join('')} 
    from treeData t where 1=1 `;

    if (parentTreeNode != null) {
      Object.keys(parentTreeNode).forEach(parentColumn => {
        const id = parentTreeNode[parentColumn];
        assertOnlyNumbers(id);
        fullSQL += ` AND "${parentColumn}" = ${id} `;
      });
    }
    fullSQL += ` GROUP BY ${quotedColumns.join(',')}`;
    console.info(fullSQL);
    const rows = await entityManager.query(fullSQL);
    console.info(JSON.stringify(rows, undefined, 2));
    return this.extractPeriodAmounts(periodIds.length, rows);
  }

  private async extractPeriodAmounts(periodsCount: number, rows: any[]) {
    return rows.map(
      ({
        stasPlanName,
        stasModelId,
        ssName,
        ssCode,
        ssId,
        snName,
        snId,
        sName,
        sId,
        sCode,
        sDescr,
        sLastUpt,
        wlCode,
        wlStatus,
        wlId,
        wlDescription,
        tpTrigram,
        dptId,
        dptTrigram,
        ...periodsInfo
      }) => {
        const periodAmounts = [];
        for (let i = 0; i < periodsCount; i++) {
          periodAmounts.push({
            keurossales: periodsInfo['keurossalesP' + i],
            keuros: periodsInfo['keurosP' + i],
            klocalcurrency: periodsInfo['klocalcurrencyP' + i],
            mandays: periodsInfo['mandaysP' + i],
          });
        }
        const res = {
          stasPlanName,
          stasModelId,
          ssName,
          ssCode,
          ssId,
          snName,
          snId,
          sName,
          sId,
          sCode,
          sDescr,
          sLastUpt,
          wlCode,
          wlStatus,
          wlId,
          wlDescription,
          tpTrigram,
          dptId,
          dptTrigram,
          periodAmounts,
        } as WorkloadTreeDataItemDTO;
        return res;
      },
    );
  }
}
