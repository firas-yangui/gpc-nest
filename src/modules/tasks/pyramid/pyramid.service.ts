import { Injectable, Logger } from '@nestjs/common';
import { In, Equal } from 'typeorm';
import * as moment from 'moment';
import { findKey, includes, join, map, startsWith } from 'lodash';

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
import { DatalakeGpcOrganizationService } from '../../datalakemapping/datalakegpcorganization.service';
import { DatalakeGpcPartnerService } from '../../datalakemapping/datalakegpcpartner.service';
import { DatalakeGpcPayorService } from '../../datalakemapping/datalakegpcpayor.service';

import { PeriodType as PeriodTypeInterface } from '../../interfaces/common-interfaces';
import { Subtypology } from 'src/modules/subtypologies/subtypology.entity';

const intExtStaffType: string[] = ['internal', 'external'];
const onshoreStaffType = 'onshore';
const actualsValideStaffType = [...intExtStaffType, onshoreStaffType, 'nearshore', 'offshore'];
const eacValideStaffType = ['outsourcing - consulting', 'outsourcing - fixed-price contract', 'restatement'];
const staffTypeWithEnvCost = ['outsourcing - consulting'];
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
    valideStaffType: [...eacValideStaffType],
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
    private readonly datalakeGpcOrganizationService: DatalakeGpcOrganizationService,
    private readonly datalakeGpcPartnerService: DatalakeGpcPartnerService,
    private readonly datalakeGpcPayorService: DatalakeGpcPayorService,
  ) {}

  isValidParams = (requiredFileds: Record<string, any>, line: any, isActual = false) => {
    requiredFileds.forEach(field => {
      if (!line[field]) return false;
    });

    return true;
  };

  isParseableLine = (line: any, fields: Record<string, any>, outsourcing: boolean): boolean => {
    let isParseable: boolean =
      line[fields.cds].trim() !== 'RESG/TPS/API' &&
      line[fields.cds].trim() !== 'RESG/TPS/GDO' &&
      line[fields.cds].trim() !== 'RISQ/DTO' &&
      line[fields.cds].trim() !== 'Global Solution Services SG GSC India (SSBU)' &&
      line[fields.caPayor].trim() !== '3000324000' &&
      line[fields.activityType].trim() !== 'Absence';

    if (outsourcing) {
      isParseable = isParseable && line[fields.curveType].trim().toLocaleLowerCase() === 'actuals';
    }
    return isParseable;
  };

  isChargeableLine = (line: any, fields: Record<string, any>): boolean => {
    return includes(fields.valideStaffType, line[fields.staffType].toLocaleLowerCase());
  };

  isJH = (subnature: string) => {
    return includes(actualsValideStaffType, subnature.toLocaleLowerCase());
  };

  isKLC = (subnature: string) => {
    return includes(eacValideStaffType, subnature.toLocaleLowerCase());
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
    return [findKey(plans, value => value === plan)];
  };

  getServiceByPortfolioName = async (portfolioName: string) => {
    return this.servicesService.findByName(portfolioName);
  };

  getThirdparty = async (line: Record<string, any>, fields: Record<string, any>, isActual: boolean): Promise<Thirdparty> => {
    const options: any = { name: line[fields.csm] };
    const thirdParty = await this.thirdpartiesService.findOne(options);
    if (!thirdParty) {
      let parendDescrFiled = line[fields.parentDescr].slice(0, 15);

      // if (!startsWith(line[fields.parentDescr], 'HRCO/')) {
      //   parendDescrFiled = line[fields.parentDescr].slice(0, 11);
      // }

      let findOptions: any = { datalakename: parendDescrFiled };
      let datalakeThirdParty = await this.datalakeGpcOrganizationService.findOne(findOptions);

      if (!datalakeThirdParty) {
        parendDescrFiled = line[fields.parentDescr].slice(0, 11);
        findOptions = { datalakename: parendDescrFiled };
        datalakeThirdParty = await this.datalakeGpcOrganizationService.findOne(findOptions);
      }

      if (!datalakeThirdParty) {
        parendDescrFiled = line[fields.parentDescr].slice(0, 7);
        findOptions = { datalakename: parendDescrFiled };
        datalakeThirdParty = await this.datalakeGpcOrganizationService.findOne(findOptions);
      }
      if (datalakeThirdParty) {
        return this.thirdpartiesService.findOne({ radical: datalakeThirdParty.dpg });
      }
    }

    return thirdParty;
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
      where: { service: Equal(service.id), subtypology: In(map(subtypologies, 'id')), code: Equal(projectCode) },
    });
  };

  getAllocations = async (
    workloads: Workload[],
    line: Record<string, any>,
    fields: Record<string, any>,
    periodAppSettings: Record<string, any>,
  ): Promise<SubsidiaryAllocation> => {
    const partner = await this.getGpcDatalakePartner(line, fields);
    if (!partner) {
      return null;
    }
    return this.subsidiaryallocationService.findOne({
      where: { thirdparty: Equal(partner.id), workload: In(workloads.map(workload => workload.id)), period: Equal(periodAppSettings.period.id) },
      relations: ['workload', 'workload.subnature'],
    });
  };

  getGpcDatalakePartner = async (line: Record<string, any>, fields: Record<string, any>) => {
    let partner: string;
    if (line[fields.partner]) {
      const datalakePartner = await this.datalakeGpcPartnerService.findOne({ datalakename: line[fields.partner] });
      if (datalakePartner) {
        partner = datalakePartner.gpcname;
      } else {
        const datalakePayor = await this.datalakeGpcPayorService.findByPayorName(line[fields.payor].trim());
        if (datalakePayor) partner = datalakePayor.gpcpartnername;
      }
    }

    if (partner) return this.thirdpartiesService.findOne({ trigram: partner });
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
          amount: line[pyramidFields.eac.eac],
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.MD,
        };

      if (this.isKLC(line[pyramidFields.eac.staffType])) {
        const eacke = line[pyramidFields.eac.eacKe];
        return {
          amount: eacke,
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

  import = async (filename, line: any, isActuals = false, outsourcing = false, isV2 = false): Promise<any> => {
    let workload: Workload;
    let fields: Record<string, any> = pyramidFields.eac;
    let requiredParams;
    if (isActuals) fields = pyramidFields.actuals;
    if (outsourcing) fields = pyramidFields.pmd;
    const periodType: string = isActuals || outsourcing ? PeriodTypeInterface.actual : PeriodTypeInterface.forecast;

    if (isActuals) requiredParams = requiredFileds.actuals;
    if (!isActuals) requiredParams = requiredFileds.eac;

    if (!this.isValidParams(requiredParams, line, isActuals)) throw new Error('invalid line param');

    if (!this.isParseableLine(line, fields, outsourcing)) throw new Error('line is not parseable');

    if (!this.isChargeableLine(line, fields)) throw new Error('Unkown subnature for line');

    if (includes(intExtStaffType, line[fields.staffType].toLocaleLowerCase())) {
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

    if (!projectCode.trim()) throw 'Project code not defined';

    const service = await this.getServiceByPortfolioName(portfolioName.trim());
    if (!service) throw `Service not found ${portfolioName.trim()}`;

    const planCodes = this.getPlanCode(plan);
    if (!planCodes) throw `Plan Code not found for plan ${plan}`;

    const subtypologies = await this.getSubtypologyByCode(planCodes);
    if (!subtypologies || !subtypologies.length) {
      throw `subTypology not found ${JSON.stringify(planCodes)}`;
    }

    const thirdparty = await this.getThirdparty(line, fields, isActuals);
    if (!thirdparty) {
      throw `thirdparty not found in line`;
    }

    let subservice: any = await this.findSubService(service, subtypologies, projectCode);
    if (!subservice) {
      const subtypologiesCodes = map(subtypologies, 'code');
      Logger.warn(
        `subservice not found for service "${service.name}" and subtypology "${join(subtypologiesCodes, ',')}" and projectCode "${projectCode}"`,
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

    const partner = await this.getGpcDatalakePartner(line, fields);
    if (!partner) throw 'Partner not found in GPC database';
    const workloadsBySubserviceThirdpartySubnature = await this.findWorkloadBySubserviceThirdpartySubnature(subnature, subservice, thirdparty);
    if (!workloadsBySubserviceThirdpartySubnature.length) {
      Logger.warn(`workload not found  with subnature "${subnature.name}" and subservice "${subservice.code}" and thirdparty "${thirdparty.name}"`);
      const codeWorkload = await this.workloadsService.generateCode('AUTO');
      const workload = await this.workloadsService.save({
        code: codeWorkload,
        description: codeWorkload,
        status: 'DRAFT',
        thirdparty: thirdparty,
        subnature: subnature,
        subservice: subservice,
      });
      workloadsBySubserviceThirdpartySubnature.push(workload);
    }
    workload = workloadsBySubserviceThirdpartySubnature[0];
    if (workloadsBySubserviceThirdpartySubnature.length > 1) {
      const previousPeriodAppSettings = await this.getPeriodAppSettings(periodType, isActuals, outsourcing, true);
      if (previousPeriodAppSettings) {
        const subsidiaryAllocation = await this.getAllocations(workloadsBySubserviceThirdpartySubnature, line, fields, previousPeriodAppSettings);
        if (subsidiaryAllocation && subsidiaryAllocation.workload) {
          workload = subsidiaryAllocation.workload;
        } else {
          Logger.warn(`partner not found for this line, an auto creation of workload an allocation will start`);
          const code: string = await this.workloadsService.generateCode('AUTO');
          const tmpWorkload = { ...workload, thirdparty, subnature, subservice, code };
          delete tmpWorkload.id;
          workload = await this.workloadsService.save(tmpWorkload);
        }
      }
    }

    const actualPeriod = periodAppSettings.period;
    // update allocations
    const allocation = await this.subsidiaryallocationService.findOne({period: actualPeriod, workload: workload});
    if(!allocation) {
      await this.subsidiaryallocationService.save({
        thirdparty: partner,
        weight: 1,
        workload,
        period: periodAppSettings.period,
      });
    }

    const prices = await this.pricesService.findOne({ where: { thirdparty: thirdparty.id, subnature: subnature.id, periodtype: actualPeriod.type } });
    const rate = await this.currencyRateService.getCurrencyRateByCountryAndPeriod(thirdparty.countryid, actualPeriod.id);

    if (!prices) throw `Price not found for thirdparty ${thirdparty.name} and subnature ${subnature.name}`;

    const costPrice = prices.price;
    const salePrice = prices.saleprice;

    const amountData = this.getAmountData(line, isActuals);
    let createdAmount = this.amountConverter.createAmountEntity(parseFloat(amountData.amount), amountData.unit, rate.value, costPrice, salePrice);

    createdAmount = { ...createdAmount, datasource: filename };

    return this.rawAmountsService.save(createdAmount, workload, actualPeriod);
  };
}
