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
const eacValideStaffType = ['outsourcing - consulting', 'outsourcing - fixed-price contract'];
const staffTypeWithEnvCost = ['outsourcing - consulting'];
const eacFields  = {
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
  caPayor: 'Activity_Ca payor',
  caPayorLabel: 'Activity_Ca payor label',
  payor: 'payor',
  clientEntity: 'Client_Entity',
    pyrTmpMonthMr: 'pyr_tmp_month_mr',
}
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
    let isParseable: boolean = (
      line[fields.cds].trim() !== 'RESG/TPS/API' &&
      line[fields.cds].trim() !== 'RESG/TPS/GDO' &&
      line[fields.cds].trim() !== 'RISQ/DTO' &&
      line[fields.payor].trim() !== 'Global Solution Services SG GSC India (SSBU)' &&
      line[fields.payor].trim() !== '3000324000' &&
      line[fields.activityType].trim() !== 'Absence'
    );
    if (outsourcing) {
      isParseable = (
        isParseable &&
        line[fields.curveType].trim().toLocaleLowerCase() === 'actuals'
      );
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

  isEnvCost = (subnature: string) => {
    return includes(staffTypeWithEnvCost, subnature.toLocaleLowerCase());
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
      let  parendDescrFiled = line[fields.parentDescr];

      if(!startsWith(line[fields.parentDescr], 'HRCO/')) {
        parendDescrFiled = line[fields.parentDescr].slice(0, 11);
      }

      let findOptions: any = { datalakename: parendDescrFiled };
      let datalakeThirdParty = await this.datalakeGpcOrganizationService.findOne(findOptions);
      
      if(!datalakeThirdParty) {
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

  getPeriodAppSettings = async (type: string, isActual: boolean, outsourcing: boolean, previous: boolean) => {
    let month = moment(Date.now());
    if (isActual || outsourcing) month = month.subtract(1, 'month');
    if (previous) month = month.subtract(1, 'month');
    return this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      type: type,
      year: month.format('YYYY'),
      month: month.format('MM'),
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
      if (line[fields.partner].trim() === 'RESG/BSC') {
        if (line[fields.portfolio]){
          switch (line[fields.portfolio].trim()) {
            case 'Offres de Services BSC':
              partner = 'BSC_OdS';
              break;
            case 'Activités transverses BSC':
              partner = 'BSC_AC';
              break;
            case 'Transformation BSC':
              partner = 'BSC_TRA';
              break;
            default: {
              const datalakePartner = await this.datalakeGpcPayorService.findByPayorName(line[fields.payor].trim());
              if (datalakePartner) {
                partner = datalakePartner.gpcpartnername;
              }
              break;
            }
          }
        }
      } else {
        const datalakePartner = await this.datalakeGpcPartnerService.findOne({ datalakename: line[fields.partner] });
        if (datalakePartner) {
          partner = datalakePartner.gpcname;
        }
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
      relations: ['subnature'],
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
        let eacke = line[pyramidFields.eac.eacKe];
        if (this.isEnvCost(line[pyramidFields.eac.staffType]) && !startsWith(line[pyramidFields.eac.parentDescr], 'HRCO'))
          eacke = eacke * 1.0626; // environment Coef

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
        let amount = line[pyramidFields.actuals.amount];
        if (this.isEnvCost(line[pyramidFields.actuals.staffType]) && !startsWith(line[pyramidFields.actuals.parentDescr], 'HRCO'))
          amount = amount * 1.0626;
        return {
          amount: amount,
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC,
        };

      }
    }
  };

  import = async (line: any, isActuals = false, outsourcing = false): Promise<any> => {
    let workload: Workload;
    let fields: Record<string, any> = pyramidFields.eac;;
    let requiredParams;
    if (isActuals) fields = pyramidFields.actuals;
    if (outsourcing) fields = pyramidFields.pmd;
    const periodType: string = (isActuals || outsourcing) ? PeriodTypeInterface.actual : PeriodTypeInterface.forecast;

    if (isActuals) requiredParams = requiredFileds.actuals;
    if (!isActuals) requiredParams = requiredFileds.eac;

    if (!this.isValidParams(requiredParams, line, isActuals)) {
      throw new Error('invalid line param');
    }

    if (!this.isParseableLine(line, fields, outsourcing)) {
      throw new Error(`line is not parseable: ${JSON.stringify(line)}`);
    }

    if (!this.isChargeableLine(line, fields)) {
      throw new Error(`Unkown subnature for line: ${JSON.stringify(line)}`);
    }

    if(includes(intExtStaffType, line[fields.staffType].toLocaleLowerCase())) {
      line[fields.staffType] = onshoreStaffType;
    }

    const subnatureName = line[fields.staffType];
    const portfolioName = line[fields.portfolio];
    const plan = line[fields.activityPlan];
    const projectCode = line[fields.ProjectCode];

    if (!subnatureName.trim()) {
      throw new Error(`subnature name not defined for line: ${JSON.stringify(line)}`);
    }
    

    if (!portfolioName.trim()) {
      throw new Error(`Service name not defined for line: ${JSON.stringify(line)}`);
    }

    if (!plan.trim()) {
      throw new Error(`Plan not defined for line: ${JSON.stringify(line)}`);
    }

    const periodAppSettings = await this.getPeriodAppSettings(periodType, isActuals, outsourcing, false);
    if (!periodAppSettings) {
      throw new Error('period not found');
    }

    if (!projectCode.trim()) {
      throw new Error(`Project code not defined for line: ${JSON.stringify(line)}`);
    }

    const service = await this.getServiceByPortfolioName(portfolioName);
    if (!service) {
      throw new Error(`Service not found ${portfolioName}`);
    }

    const planCodes = this.getPlanCode(plan);
    if (!planCodes) {
      throw new Error(`Plan Code not found for plan ${plan}`);
    }

    const subtypologies = await this.getSubtypologyByCode(planCodes);
    if (!subtypologies || !subtypologies.length) {
      throw new Error(`subTypology not found ${planCodes}`);
    }

    const thirdparty = await this.getThirdparty(line, fields, isActuals);
    if (!thirdparty) {
      throw new Error(`thirdparty not found in line : ${JSON.stringify(line)}`);
    }

    let subservice: any = await this.findSubService(service, subtypologies, projectCode);
    if (!subservice) {
      Logger.warn(`subservice not found for service "${service.name}" and subtypology "${join(map(subtypologies, 'code'), ',')}" and projectCode "${projectCode}"`);
      subservice = await this.subservicesService.save(
        {
          code: projectCode,
          name: line[fields.ProjectName],
          service,
          thirdpPartyId: thirdparty.id,
          subtypology: subtypologies[0]
        }
      );
    }
    const subnature = await this.subnatureService.findByName(subnatureName);
    if (!subnature) {
      throw new Error(`subNature not found with name: "${subnatureName}"`);
    }

    const workloadsBySubserviceThirdpartySubnature = await this.findWorkloadBySubserviceThirdpartySubnature(subnature, subservice, thirdparty);
    
    if (!workloadsBySubserviceThirdpartySubnature.length) {
      Logger.warn(`workload not found  with subnature "${subnature.name}" and subservice "${subservice.code}" and thirdparty "${thirdparty.name}"`);
      const codeWorkload = await this.workloadsService.generateCode();
      const workload = await this.workloadsService.save({
        code: codeWorkload,
        description: codeWorkload,
        status: 'DRAFT',
        thirdparty: thirdparty,
        subnature: subnature,
        subservice: subservice
      });
      const partner = await this.getGpcDatalakePartner(line, fields);
      if(partner) {
        this.subsidiaryallocationService.save({
          thirdparty: partner,
          weight: 1,
          workload,
          period: periodAppSettings.period
        });
      }
      workloadsBySubserviceThirdpartySubnature.push(workload);
    }

    workload = workloadsBySubserviceThirdpartySubnature[0];
    if (workloadsBySubserviceThirdpartySubnature.length > 1) {
      const previousPeriodAppSettings = await this.getPeriodAppSettings(periodType, isActuals, outsourcing, true);
      if (previousPeriodAppSettings) {
        const subsidiaryAllocation = await this.getAllocations(workloadsBySubserviceThirdpartySubnature, line, fields, previousPeriodAppSettings);
        if (!subsidiaryAllocation) {
          throw new Error(`subsidiaryAllocation not found by subsidiary allocations for line ${JSON.stringify(line)}`);
        }
        if (!subsidiaryAllocation.workload) {
          throw new Error(`workload not found by subsidiary allocations for line ${JSON.stringify(line)}`);
        }
        workload = subsidiaryAllocation.workload;
      }
    }

    const actualPeriod = periodAppSettings.period;

    const prices = await this.pricesService.findOne({ where: { thirdparty: thirdparty.id, subnature: subnature.id, periodtype: actualPeriod.type } });
    const rate = await this.currencyRateService.getCurrencyRateByCountryAndPeriod(thirdparty.countryid, actualPeriod.id);

    if (!prices) {
      throw new Error(`Price not found for thirdparty ${thirdparty.name} and subnature ${subnature.name}`);
    }

    const costPrice = prices.price;
    const salePrice = prices.saleprice;

    const amountData = this.getAmountData(line, isActuals);

    let createdAmount = this.amountConverter.createAmountEntity(parseFloat(amountData.amount), amountData.unit, rate.value, costPrice, salePrice);

    createdAmount = { ...createdAmount };
    
    return this.rawAmountsService.save(createdAmount, workload, actualPeriod);
  };
}
