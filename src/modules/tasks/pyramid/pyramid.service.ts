import { Injectable, Logger } from '@nestjs/common';
import { In, Equal, MoreThan } from 'typeorm';
import * as moment from 'moment';
import * as _ from 'lodash';

import { RawAmountsService } from '../../rawamounts/rawamounts.service';
import { AmountConverter } from '../../amounts/amounts.converter';
import { CurrencyRateService } from '../../currency-rate/currency-rate.service';
import { WorkloadsService } from '../../workloads/workloads.service';
import { PeriodsService } from '../../periods/periods.service';
import { SubservicesService } from '../../subservices/subservices.service';
import { Workload } from '../../workloads/workload.entity';
import { ThirdpartiesService } from '../../thirdparties/thirdparties.service';
import { Thirdparty } from '../../thirdparties/thirdparty.entity';
import { SubsidiaryAllocation } from '../../subsidiaryallocation/subsidiaryallocation.entity';
import { SubsidiaryallocationService } from '../../subsidiaryallocation/subsidiaryallocation.service';
import { SubtypologiesService } from '../../subtypologies/subtypologies.service';
import { SubnatureService } from '../../subnature/subnature.service';
import { ServicesService } from '../../services/services.service';
import { PricesService } from '../../prices/prices.service';
import { ConstantService } from '../../constants/constants';
import { ImportMappingService } from '../../importmapping/importmapping.service';

import { PeriodType as PeriodTypeInterface } from '../../interfaces/common-interfaces';
import { Subtypology } from 'src/modules/subtypologies/subtypology.entity';
import { ActivityService } from '../../activity/activity.service';
import { ActivityCapayorService } from '../../activity-capayor/activity-capayorservice';
import { Activity } from 'src/modules/activity/activity.entity';
import { ActivityCapayor } from '../../activity-capayor/activity-capayor.entity';
import { CaPayorService } from '../../capayor/capayor.service';
const importName = 'PYRAMID';
const mappingTypes = {
  orga: 'ORGA',
  partner: 'PARTNER',
  payor: 'PAYOR',
};
const intExtStaffType: string[] = ['internal', 'external'];
const onshoreStaffType = 'onshore';
const actualsValideStaffType = [...intExtStaffType, onshoreStaffType, 'nearshore', 'offshore'];
const outsourcingValideStaffType = ['outsourcing - consulting', 'outsourcing - fixed-price contract', 'restatement'];
const eacValideStaffType = [
  ...outsourcingValideStaffType,
  'gbsu - contribution',
  'itim - contribution',
  'other - contribution',
  'gts - hosting and client request',
  'irbs - contribution',
  'software acquisition',
  'gts - client projects',
  'it rental and maintenance',
  'travels',
  'other',
];

const eacFields = {
  ProjectCode: 'Project_Code',
  ProjectName: 'Project_Name',
  activityApplication: 'Activity_Application',
  activityApplicationLabel: 'Activity_Application_Label',
  curveType: 'curve_type',
  eac: 'eac',
  eacKe: 'eac_ke',
  actualMd: 'actuals_md',
  cds: 'CDS',
  csm: 'CSM',
  parentDescr: 'PARENT_DESCR',
  staffType: 'staff_type',
  activityPlan: 'activity_plan',
  activityType: 'activity_type',
  portfolio: 'portfolio',
  subPortfolio: 'sub_portfolio',
  partner: 'partner',
  caPayor: 'code_ca_payor',
  caPayorLabel: 'Activity_Ca payor label',
  payor: 'payor',
  clientEntity: 'Client_Entity',
  pyrTmpMonthMr: 'pyr_tmp_month_mr',
};
const pyramidFields = {
  eac: {
    ...eacFields,
    valideStaffType: [...actualsValideStaffType, ...eacValideStaffType],
  },
  pmd: {
    ...eacFields,
    valideStaffType: [...outsourcingValideStaffType],
  },
  actuals: {
    amount: 'standard_actuals_integrated_md',
    activityPlan: 'plan',
    activityType: 'activity_Type',
    cds: 'Ressource_CDS',
    csm: 'Ressource_CSM',
    staffType: 'Ressource_Staff_Type',
    valideStaffType: actualsValideStaffType,
    portfolio: 'portfolio_sub_portfolio',
    ProjectCode: 'Project_code',
    ProjectName: 'schedule_name',
    payor: 'Label_Payor',
    caPayor: 'payor',
    parentDescr: 'Client_Entity',
    partner: 'Partner',
  },
};

const requiredFileds = {
  eac: [
    pyramidFields.eac.staffType,
    pyramidFields.eac.portfolio,
    pyramidFields.eac.activityPlan,
    pyramidFields.eac.ProjectCode,
    pyramidFields.eac.eac,
    pyramidFields.eac.eacKe,
  ],
  actuals: [
    pyramidFields.actuals.staffType,
    pyramidFields.actuals.portfolio,
    pyramidFields.actuals.activityPlan,
    pyramidFields.actuals.ProjectCode,
    pyramidFields.actuals.amount,
  ],
};

@Injectable()
export class PyramidService {
  constructor(
    private readonly rawAmountsService: RawAmountsService,
    private readonly amountConverter: AmountConverter,
    private readonly workloadsService: WorkloadsService,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly periodsService: PeriodsService,
    private readonly subservicesService: SubservicesService,
    private readonly servicesService: ServicesService,
    private readonly subsidiaryallocationService: SubsidiaryallocationService,
    private readonly subtypologiesService: SubtypologiesService,
    private readonly subnatureService: SubnatureService,
    private readonly constantService: ConstantService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly pricesService: PricesService,
    private readonly importMappingService: ImportMappingService,
    private readonly activityCapayorService: ActivityCapayorService,
    private readonly activityService: ActivityService,
    private readonly caPayorService: CaPayorService,
  ) {}

  isValidParams = (requiredFileds: string[], line: any) => {
    for (const field of requiredFileds) {
      if (!line[field]) return false;
    }

    return true;
  };

  isParseableLine = (line: any, { cds, caPayor, activityType, curveType }: Record<string, any>, outsourcing: boolean): boolean => {
    switch (true) {
      case ['RESG/TPS/API', 'RESG/TPS/GDO', 'RISQ/DTO'].includes(line[cds]):
      case ['3000324000'].includes(line[caPayor]):
      case ['Absence'].includes(line[activityType]):
      case outsourcing && !line[curveType]?.match(/actuals/i)?.length:
        return false;
      default:
        return true;
    }
  };

  isChargeableLine = (line: any, fields: Record<string, any>): boolean => {
    return _.includes(fields.valideStaffType, line[fields.staffType].toLocaleLowerCase());
  };

  isJH = (subnature: string) => {
    return _.includes(actualsValideStaffType, subnature.toLocaleLowerCase());
  };

  isKLC = (subnature: string) => {
    return _.includes(eacValideStaffType, subnature.toLocaleLowerCase());
  };

  getSubtypologyByCode = async (codes: string[]) => {
    return this.subtypologiesService.findByCodes(codes);
  };

  getPlanCode = (plan: string) => {
    const plans = {
      35: 'Structure',
      12: 'Evolutive Maintenance',
      58: 'Run activities',
      P1: 'Project',
      13: 'Tech Plan',
    };
    if (plan === 'Project') return ['P1', 'T1'];
    return [_.findKey(plans, value => value === plan)];
  };

  getServiceByPortfolioName = async (portfolioName: string) => {
    return this.servicesService.findByName(portfolioName);
  };

  getThirdparty = async (line: Record<string, any>, fields: Record<string, any>): Promise<Thirdparty> => {
    const options: any = { name: line[fields.csm] };
    let thirdParty = await this.thirdpartiesService.findOne(options);
    if (thirdParty) return thirdParty;

    let parendDescrFiled = line[fields.parentDescr].slice(0, 15);
    thirdParty = await this.importMappingService.getMapping(importName, mappingTypes.orga, parendDescrFiled.trim());
    if (thirdParty) return thirdParty;

    parendDescrFiled = line[fields.parentDescr].slice(0, 11);
    thirdParty = await this.importMappingService.getMapping(importName, mappingTypes.orga, parendDescrFiled.trim());
    if (thirdParty) return thirdParty;

    parendDescrFiled = line[fields.parentDescr].slice(0, 7);
    thirdParty = await this.importMappingService.getMapping(importName, mappingTypes.orga, parendDescrFiled.trim());
    if (thirdParty) return thirdParty;

    return null;
  };

  getPeriodAppSettings = async (type: string, isActual: boolean, outsourcing: boolean, previous: boolean, isV2 = false) => {
    let month = moment(Date.now());
    if (isActual || outsourcing) month = month.subtract(1, 'month');
    if (previous) month = month.subtract(1, 'month');
    let endWith = '_';
    if (isV2) endWith = '_V2';

    return this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      type,
      year: month.format('YYYY'),
      month: month.format('MM'),
      endWith,
    });
  };

  findSubService = async (service: Record<string, any>, subtypologies: Subtypology[], projectCode: string) => {
    return this.subservicesService.findOne({
      where: { service: Equal(service.id), subtypology: In(_.map(subtypologies, 'id')), code: Equal(projectCode) },
    });
  };

  getAllocations = async (workloads: Workload[], partner, periodAppSettings: Record<string, any>): Promise<SubsidiaryAllocation> => {
    return this.subsidiaryallocationService.findOne({
      where: { thirdparty: Equal(partner.id), workload: In(workloads.map(workload => workload.id)), period: Equal(periodAppSettings.period.id) },
      relations: ['workload', 'workload.subnature'],
    });
  };

  getGpcDatalakePartner = async (line: Record<string, any>, fields: Record<string, any>) => {
    const partnerValue = line[fields.partner].trim();
    if (partnerValue) {
      let partner = await this.importMappingService.getMapping(importName, mappingTypes.partner, partnerValue);
      if (partner) return partner;
      const payorValue = line[fields.payor].trim();
      if (payorValue) {
        partner = await this.importMappingService.getMapping(importName, mappingTypes.payor, payorValue);
        if (partner) return partner;
      }
    }
    return null;
  };

  findWorkloadBySubserviceThirdpartySubnature = (
    subnature: Record<string, any>,
    subservice: Record<string, any>,
    orga: Record<string, any>,
  ): Promise<Workload[]> => {
    return this.workloadsService.find({
      relations: ['subnature', 'subservice', 'thirdparty'],
      where: {
        subnature: subnature.id,
        subservice: subservice.id,
        thirdparty: orga.id,
      },
    });
  };

  getAmountData = (line, isActuals: boolean) => {
    if (!isActuals) {
      if (this.isJH(line[pyramidFields.eac.staffType]))
        return {
          amount: line[pyramidFields.eac.eac].replace(',', '.'),
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.MD,
        };

      if (this.isKLC(line[pyramidFields.eac.staffType])) {
        const eacke = line[pyramidFields.eac.eacKe];
        return {
          amount: eacke.replace(',', '.'),
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC,
        };
      }
    }

    if (isActuals) {
      if (this.isJH(line[pyramidFields.actuals.staffType]))
        return {
          amount: line[pyramidFields.actuals.amount],
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.MD,
        };
      if (this.isKLC(line[pyramidFields.actuals.staffType])) {
        const amount = line[pyramidFields.actuals.amount];
        return {
          amount: amount,
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC,
        };
      }
    }
  };

  formatProjectCode = (projectCode: string): string => {
    projectCode = projectCode.trim();
    switch (projectCode.length) {
      case 1:
        return '0000'.concat(projectCode);
      case 2:
        return '000'.concat(projectCode);
      case 3:
        return '00'.concat(projectCode);
      case 4:
        return '0'.concat(projectCode);
      default:
        return projectCode;
    }
  };

  createWorkload = async (workload): Promise<Workload> => {
    workload.code = workload.description = await this.workloadsService.generateCode('AUTO');
    return await this.workloadsService.save(workload);
  };

  parseExponential = (exponential: string): string => {
    if (exponential.match(/E\+/i)) {
      const [nb, exp] = exponential.split(/E\+/i);
      return Math.round(parseFloat(nb.replace(/,|\./, '.')) * Math.pow(10, parseInt(exp))).toString();
    } else return exponential;
  };

  getPartners = async (pActivityCode): Promise<any[]> => {
    const activityCode = this.parseExponential(pActivityCode);

    const activity: Activity = await this.activityService.findOne({ where: { activityCode } });
    if (!activity) throw 'no activity found for activityCode ' + activityCode;
    const payors: ActivityCapayor[] = await this.activityCapayorService.find({
      relations: ['activity', 'capayor'],
      where: { activity: { id: activity.id }, endDate: MoreThan(moment().format('YYYY-MM-DD')) },
    });
    if (!payors.length) throw 'no thirdparty found for activityCode ' + activityCode;
    const sum: number = payors.map(({ percent }) => parseFloat(percent.toString())).reduce((total, percent) => total + percent);
    if (Math.round(sum * 100) / 100 != 100) throw `sum not equal to 100, ${sum}`;

    const res = [],
      err = [];
    for (const {
      capayor: { partnerTrigram: trigram },
      percent,
    } of payors) {
      const partner = await this.thirdpartiesService.findOne({ trigram });
      if (partner) {
        res.push({ partner, percent });
      } else err.push(`partner not found for trigram ${trigram}`);
    }

    if (err.length) {
      throw err.toString();
    }

    return res;
  };

  import = async (filename, line: any, isActuals = false, outsourcing = false, isV2 = false): Promise<any> => {
    let workload: any;
    let fields: Record<string, any> = pyramidFields.eac;
    let requiredParams;
    if (isActuals) fields = pyramidFields.actuals;
    if (outsourcing) fields = pyramidFields.pmd;
    const periodType: string = isActuals || outsourcing ? PeriodTypeInterface.actual : PeriodTypeInterface.forecast;

    if (isActuals) requiredParams = requiredFileds.actuals;
    if (!isActuals) requiredParams = requiredFileds.eac;

    if (!this.isValidParams(requiredParams, line)) throw new Error('invalid line param');

    if (!this.isParseableLine(line, fields, outsourcing)) throw new Error('line is not parseable');

    if (!this.isChargeableLine(line, fields)) throw new Error('Unkown subnature for line');

    if (_.includes(intExtStaffType, line[fields.staffType].toLocaleLowerCase())) {
      line[fields.staffType] = onshoreStaffType;
    }

    const subnatureName = line[fields.staffType];
    const portfolioName = line[fields.portfolio];
    const plan = line[fields.activityPlan];
    const projectCode = this.formatProjectCode(line[fields.ProjectCode]);

    if (!subnatureName.trim()) throw 'subnature name not defined';
    if (!portfolioName.trim()) throw 'Service name not defined';
    if (!plan.trim()) throw 'Plan not defined';

    const periodAppSettings = await this.getPeriodAppSettings(periodType, isActuals, outsourcing, false, isV2);
    if (!periodAppSettings) throw 'period not found';
    const currentPeriod = periodAppSettings.period;

    if (!projectCode.trim()) throw 'Project code not defined';

    const service = await this.getServiceByPortfolioName(portfolioName.trim());
    if (!service) throw `Service not found ${portfolioName.trim()}`;

    const planCodes = this.getPlanCode(plan);
    if (!planCodes) throw `Plan Code not found for plan ${plan}`;

    const subtypologies = await this.getSubtypologyByCode(planCodes);
    if (!subtypologies || !subtypologies.length) {
      throw `subTypology not found ${JSON.stringify(planCodes)}`;
    }

    const thirdparty = await this.getThirdparty(line, fields);
    if (!thirdparty) {
      throw `thirdparty not found in line`;
    }

    let subservice: any = await this.findSubService(service, subtypologies, projectCode);
    if (!subservice) {
      const subtypologiesCodes = _.map(subtypologies, 'code');
      Logger.warn(
        `subservice not found for service "${service.name}" and subtypology "${_.join(subtypologiesCodes, ',')}" and projectCode "${projectCode}"`,
      );
      const owner = await this.thirdpartiesService.findOne({ name: 'RESG/BSC' });
      if (!owner) throw 'subservice owner "RESG/BSC" not found';
      subservice = await this.subservicesService.save({
        code: projectCode,
        name: line[fields.ProjectName],
        service,
        thirdpPartyId: owner.id,
        subtypology: subtypologies[0],
      });
      if (!subservice) throw 'subservice could not be created';
    }
    const subnature = await this.subnatureService.findByName(subnatureName.trim());
    if (!subnature) throw `subNature not found with name: "${subnatureName.trim()}"`;

    const workloadsBySubserviceThirdpartySubnature = await this.findWorkloadBySubserviceThirdpartySubnature(subnature, subservice, thirdparty);
    const isMultiCa = line[fields.caPayor] === '3000377777';
    let partners;
    if (isMultiCa) {
      partners = await this.getPartners(line.activity_code);
    } else {
      const partner = await this.getGpcDatalakePartner(line, fields);
      if (!partner) throw 'Partner not found in GPC database';
      partners = [{ partner, percent: 100 }];
    }

    for (const { partner, percent } of partners) {
      let newWorkload = true;
      workload = {};
      if (workloadsBySubserviceThirdpartySubnature.length) {
        // check allocations on the current period
        const allocation = await this.getAllocations(workloadsBySubserviceThirdpartySubnature, partner, periodAppSettings);
        if (allocation) {
          workload = allocation.workload;
          newWorkload = false;
        } else {
          // check allocations on the current period
          const previousPeriodAppSettings = await this.getPeriodAppSettings(periodType, isActuals, outsourcing, true);
          if (previousPeriodAppSettings) {
            const prevAllocation = await this.getAllocations(workloadsBySubserviceThirdpartySubnature, partner, previousPeriodAppSettings);
            if (prevAllocation) {
              workload = prevAllocation.workload;
              newWorkload = false;
            }
          }
        }
      }

      const prices = await this.pricesService.findOne({ where: { thirdparty: thirdparty, subnature: subnature, periodtype: currentPeriod.type } });
      const rate = await this.currencyRateService.getCurrencyRateByCountryAndPeriod(thirdparty.countryid, currentPeriod.id);

      if (!prices) throw `Price not found for thirdparty ${thirdparty.name} and subnature ${subnature.name}`;

      if (newWorkload) {
        Logger.warn(`workload not found  with subnature "${subnature.name}" and subservice "${subservice.code}" and thirdparty "${thirdparty.name}"`);
        workload = await this.createWorkload({
          status: 'DRAFT',
          thirdparty: thirdparty,
          subnature: subnature,
          subservice: subservice,
        });
      }

      // update allocations
      const allocation = await this.subsidiaryallocationService.findOne({ period: currentPeriod, workload });
      if (!allocation) {
        await this.subsidiaryallocationService.save({
          thirdparty: partner,
          weight: 1,
          workload,
          period: currentPeriod,
        });
      }

      const costPrice = prices.price;
      const salePrice = prices.saleprice;

      const amountData = this.getAmountData(line, isActuals);
      let createdAmount = this.amountConverter.createAmountEntity(
        (parseFloat(amountData?.amount?.replace(',', '.')) * percent) / 100,
        amountData.unit,
        rate.value,
        costPrice,
        salePrice,
      );

      createdAmount = { ...createdAmount, datasource: filename };
      await this.rawAmountsService.save(createdAmount, workload, currentPeriod);
    }

    return;
  };
}
