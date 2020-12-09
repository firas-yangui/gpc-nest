import { Injectable, Logger } from '@nestjs/common';
import { Like, In, Equal } from 'typeorm';
import * as moment from 'moment';
import { findKey, includes } from 'lodash';

import { RawAmountsService } from './../../rawamounts/rawamounts.service';
import { AmountConverter } from './../../amounts/amounts.converter';
import { CurrencyRateService } from './../../currency-rate/currency-rate.service';
import { WorkloadsService } from './../../../modules/workloads/workloads.service';
import { PeriodsService } from './../../periods/periods.service';
import { SubservicesService } from './../../subservices/subservices.service';
import { Workload } from './../../workloads/workload.entity';
import { ThirdpartiesService } from './../../thirdparties/thirdparties.service';
import { Thirdparty } from './../../thirdparties/thirdparty.entity';
import { SubsidiaryAllocation } from './../../subsidiaryallocation/subsidiaryallocation.entity';
import { SubsidiaryallocationService } from './../../subsidiaryallocation/subsidiaryallocation.service';
import { SubtypologiesService } from './../../subtypologies/subtypologies.service';
import { SubnatureService } from './../../subnature/subnature.service';
import { ServicesService } from './../../services/services.service';
import { PricesService } from './../../prices/prices.service';
import { ConstantService } from './../../constants/constants';
import { DatalakeGpcOrganizationService } from '../../datalakemapping/datalakegpcorganization.service';
import { DatalakeGpcPartnerService } from '../../datalakemapping/datalakegpcpartner.service';
import { DatalakeGpcPayorService } from '../../datalakemapping/datalakegpcpayor.service';

import { PeriodType as PeriodTypeInterface } from './../../interfaces/common-interfaces';

const actualsValideStaffType = ['internal', 'external', 'nearshore', 'offshore'];
const eacValideStaffType = ['outsourcing - consulting', 'outsourcing - fixed-price contract'];

const pyramidFields = {
  eac: {
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
    valideStaffType: [...actualsValideStaffType, ...eacValideStaffType],
    activityPlan: 'activity_plan',
    activityType: 'activity_type',
    portfolio: 'portfolio',
    subPortfolio: 'sub_portfolio',
    partner: 'partner',
    caPayor: 'Activity_Ca payor',
    caPayorLabel: 'Activity_Ca payor label',
    payor: 'code_ca_payor',
    clientEntity: 'Client_Entity',
    pyrTmpMonthMr: 'pyr_tmp_month_mr',
  },
  actuals: {
    amount: 'standard_actuals_md',
    activityPlan: 'plan',
    activityType: 'activity_type',
    cds: 'ressource_cds',
    csm: 'ressource_csm',
    staffType: 'ressource_staff_type',
    valideStaffType: actualsValideStaffType,
    portfolio: 'portfolio_sub_portfolio',
    ProjectCode: 'project_code',
    payor: 'payor',
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
export class CallbackPyramidParser {
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

  isParseableLine = (line: any, fields: Record<string, any>): boolean => {
    return (
      fields.cds.trim() !== 'RESG/TPS' &&
      fields.cds.trim() !== 'RISQ/DTO' &&
      fields.payor.trim() !== '3000324000' &&
      fields.activityType.trim() !== 'Absence'
    );
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

  getSubtypologyByCode = async (code: string) => {
    return this.subtypologiesService.findOne({ code: code });
  };

  getPlanCode = (plan: string) => {
    const plans = {
      35: 'Structure',
      12: 'Evolutive Maintenance',
      58: 'Run activities',
      P1: 'Project',
      13: 'Tech Plan',
    };
    return findKey(plans, value => value === plan);
  };

  getServiceByPortfolioName = async (portfolioName: string) => {
    //TODO mapping portfolio english & frensh
    return this.servicesService.findOne({
      where: { name: Like(portfolioName) },
    });
  };

  getThirdparty = async (line: Record<string, any>, fields: Record<string, any>, isActual: boolean): Promise<Thirdparty> => {
    //TODO mapping

    const thirdParty = await this.thirdpartiesService.findOne({ name: line[fields.csm] });
    if (!isActual && !thirdParty) {
      let findOptions: any = { datalakename: line[fields.parentDescr] };
      if (includes(['GSC/CRL/MGT/MGT', 'GSC/ARS/ARS/MGT', 'GSC/H2R/H2R/MGT', 'GSC/DAT/DAT/MGT'], line[fields.parentDescr])) {
        findOptions = { ...findOptions, projectname: line[fields.ProjectName] };
      }
      const datalakeThirdParty = await this.datalakeGpcOrganizationService.findOne(findOptions);
      if (datalakeThirdParty) {
        return this.thirdpartiesService.findOne({ trigram: datalakeThirdParty.gpcname });
      }
    }
    return thirdParty;
  };

  getPeriodAppSettings = async (type: string, isActual: boolean) => {
    let month = moment(Date.now());

    if (isActual) month = month.subtract(1, 'month');
    return this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      type: type,
      year: moment(Date.now()).format('YYYY'),
      month: month.format('MM'),
    });
  };

  findSubService = async (service: Record<string, any>, subtypology: Record<string, any>, projectCode: string) => {
    return this.subservicesService.findOne({
      where: { service: Equal(service.id), subtypology: Equal(subtypology.id), code: Equal(projectCode) },
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
      relations: ['workload'],
    });
  };

  getGpcDatalakePartner = async (line: Record<string, any>, fields: Record<string, any>) => {
    if (fields.partner.trim() === 'RESG/BSC') {
      let partner: string;
      switch (fields.portfolio.trim()) {
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
          const datalakePartner = await this.datalakeGpcPayorService.findOne({ payorname: line[fields.payor] });
          partner = datalakePartner.gpcpartnername;
          break;
        }
      }
      return this.thirdpartiesService.findOne({ trigram: partner });
    } else {
      const datalakePartner = await this.datalakeGpcPartnerService.findOne({ datalakename: line[fields.partner] });
      if (datalakePartner) {
        return this.thirdpartiesService.findOne({ trigram: datalakePartner.gpcname });
      }
      return null;
    }
  };

  findWorkloadBySubserviceThirdpartySubnature = (
    subnature: Record<string, any>,
    subservice: Record<string, any>,
    orga: Record<string, any>,
  ): Promise<Workload[]> => {
    return this.workloadsService.find({
      where: {
        subnature: subnature.id,
        subservice: subservice.id,
        thirdparty: orga.id,
      },
    });
  };

  getAmountData = (line, isActuals = false) => {
    if (!isActuals) {
      if (this.isJH(line[pyramidFields.eac.staffType]))
        return {
          amount: line[pyramidFields.eac.eac],
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.MD,
        };
      if (this.isKLC(line[pyramidFields.eac.staffType]))
        return {
          amount: line[pyramidFields.eac.eacKe],
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC,
        };
    }

    if (isActuals) {
      if (this.isJH(line[pyramidFields.actuals.staffType]))
        return {
          amount: line[pyramidFields.actuals.amount],
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.MD,
        };
      if (this.isKLC(line[pyramidFields.actuals.staffType]))
        return {
          amount: line[pyramidFields.actuals.amount],
          unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC,
        };
    }
  };

  parse = async (line: any, metadata: Record<string, any>, isActuals = false) => {
    let workload: Record<string, any>;
    let fields: Record<string, any>;
    let requiredParams;
    if (isActuals) fields = pyramidFields.actuals;
    if (!isActuals) fields = pyramidFields.eac;
    const periodType: string = isActuals ? PeriodTypeInterface.actual : PeriodTypeInterface.forecast;

    if (isActuals) requiredParams = requiredFileds.actuals;
    if (!isActuals) requiredParams = requiredFileds.eac;

    if (!this.isValidParams(requiredParams, line, isActuals)) {
      Logger.error('invalide line param');
      return Promise.reject(new Error('invalide line param'));
    }

    if (!this.isParseableLine(line, fields)) {
      throw new Error('line is not parseable');
    }

    if (!this.isChargeableLine(line, fields)) {
      throw new Error('line is not chargeable');
    }

    const subnatureName = line[fields.staffType];
    const portfolioName = line[fields.portfolio];
    const plan = line[fields.activityPlan];
    const projectCode = line[fields.ProjectCode];
    const datasource = metadata.filename;

    const periodAppSettings = await this.getPeriodAppSettings(periodType, isActuals);

    if (!periodAppSettings) {
      Logger.error('period not found');
      throw new Error('period not found');
    }

    const service = await this.getServiceByPortfolioName(portfolioName);
    if (!service) {
      Logger.error('Service not found');
      throw new Error('Service not found');
    }

    const planCode = this.getPlanCode(plan);
    if (!planCode) {
      Logger.error(`Plan Code not found for plan ${plan}`);
      throw new Error(`Plan Code not found for plan ${plan}`);
    }

    const subtypology = await this.getSubtypologyByCode(planCode);
    if (!subtypology) {
      Logger.error(`subTypology not found`);
      throw new Error('subTypology not found');
    }

    const thirdparty = await this.getThirdparty(line, fields, isActuals);
    if (!thirdparty) {
      Logger.error(`thirdparty not found`);
      throw new Error('thirdparty not found');
    }

    const subservice = await this.findSubService(service, subtypology, projectCode);
    if (!subservice) {
      Logger.error(`subservice not found`);
      throw new Error('subservice not found');
    }

    const subnature = await this.subnatureService.findOne({ where: { name: subnatureName } });
    if (!subnature) {
      Logger.error(`subNature not found`);
      throw new Error('subNature not found');
    }

    const workloadsBySubserviceThirdpartySubnature = await this.findWorkloadBySubserviceThirdpartySubnature(subnature, subservice, thirdparty);
    if (!workloadsBySubserviceThirdpartySubnature.length) {
      Logger.error(`workload not found`);
      throw new Error('workload not found');
    }

    workload = workloadsBySubserviceThirdpartySubnature[0];

    if (workloadsBySubserviceThirdpartySubnature.length > 1) {
      const subsidiaryAllocation = await this.getAllocations(workloadsBySubserviceThirdpartySubnature, line, fields, periodAppSettings);
      if (!subsidiaryAllocation) {
        Logger.error(`subsidiaryAllocation not found by subsidiary allocations`);
        throw new Error('subsidiaryAllocation not found by subsidiary allocations');
      }
      if (!subsidiaryAllocation.workload) {
        Logger.error(`workload not found by subsidiary allocations`);
        throw new Error('workload not found by subsidiary allocations');
      }
      workload = subsidiaryAllocation.workload;
    }

    const actualPeriod = periodAppSettings.period;

    const prices = await this.pricesService.findOne({ where: { thirdparty: thirdparty.id, subnature: subnature.id, periodtype: actualPeriod.type } });
    const rate = await this.currencyRateService.getCurrencyRateByCountryAndPeriod(thirdparty.countryid, actualPeriod.id);

    if (!prices) {
      Logger.error('Price not found');
      throw new Error('Price not found');
    }

    const costPrice = prices.price;
    const salePrice = prices.saleprice;

    const amountData = this.getAmountData(line, isActuals);

    let createdAmount = this.amountConverter.createAmountEntity(parseFloat(amountData.amount), amountData.unit, rate.value, costPrice, salePrice);

    createdAmount = { ...createdAmount, workloadid: workload.id, periodid: actualPeriod.id, datasource: datasource };

    return this.rawAmountsService.save(createdAmount);
  };
  end = () => {};
}
