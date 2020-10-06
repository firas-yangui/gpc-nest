import { Injectable } from '@nestjs/common';
import * as moment from 'moment';
import { includes } from 'lodash';
import { AmountsService } from './../../amounts/amounts.service';
import { ResourceManager } from './../nosica/resource-store';
import { AmountConverter } from './../../amounts/amounts.converter';
import { CurrencyRateService } from './../../currency-rate/currency-rate.service';
import { WorkloadsService } from './../../../modules/workloads/workloads.service';
import { PeriodsService } from './../../periods/periods.service';
import { PortfolioService } from './../../portfolio/portfolio.service';
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
import { Like, In, Equal } from 'typeorm';

const pyramidFields = {
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
  clientEntity: 'Client_Entity',
  pyrTmpMonthMr: 'pyr_tmp_month_mr',
};

const requiredFileds = [
  pyramidFields.staffType,
  pyramidFields.portfolio,
  pyramidFields.activityPlan,
  pyramidFields.ProjectCode,
  pyramidFields.eac,
  pyramidFields.eacKe,
];

@Injectable()
export class CallbackPyramidParser {
  constructor(
    private readonly amountsService: AmountsService,
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
    private readonly resourceManager: ResourceManager,
  ) {}

  isValidParams = (line: any) => {
    requiredFileds.forEach(field => {
      if (!line[field]) return false;
    });
    return true;
  };

  isJH = (subnature: string) => {
    return includes(['internal', 'external', 'nearshore', 'offshore'], subnature.toLocaleLowerCase());
  };

  isKLC = (subnature: string) => {
    return includes(['outsourcing consulting', 'outsourcing fixed price'], subnature.toLocaleLowerCase());
  };

  getSubtypologyByName = async (name: string) => {
    //TODO mapping
    return this.subtypologiesService.findOne({ name: name });
  };

  getServiceByPortfolioName = async (portfolioName: string) => {
    //TODO mapping portfolio english & frensh
    return this.servicesService.findOne({
      where: { name: Like(portfolioName) },
    });
  };

  getThirdpartyByName = async (name: string): Promise<Thirdparty> => {
    //TODO mapping
    return this.thirdpartiesService.findOne({ name: name });
  };

  getActualLastPeriodAppSettings = async (month: string) => {
    return this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      type: 'actual',
      year: moment(Date.now()).format('YYYY'),
      month: month,
    });
  };

  findSubService = async (service: Record<string, any>, subtypology: Record<string, any>, projectCode: string) => {
    return this.subservicesService.findOne({
      where: { service: Equal(service.id), subtypology: Equal(subtypology.id), code: Equal(projectCode) },
    });
  };

  getAllocationsByThirdparty = async (
    workloads: Workload[],
    thirdparty: Record<string, any>,
    periodAppSettings: Record<string, any>,
  ): Promise<SubsidiaryAllocation> => {
    return this.subsidiaryallocationService.findOne({
      where: { thirdparty: Equal(thirdparty.id), workload: In(workloads.map(workload => workload.id)), period: Equal(periodAppSettings.period.id) },
      relations: ['workload'],
    });
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

  getAmountData = line => {
    if (this.isJH(line[pyramidFields.staffType]))
      return {
        amount: line[pyramidFields.eac],
        unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.MD,
      };
    if (this.isKLC(line[pyramidFields.staffType]))
      return {
        amount: line[pyramidFields.eacKe],
        unit: this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC,
      };
  };

  parse = async (line: any, metadata: Record<string, any>) => {
    let workload;

    if (!this.isValidParams(line)) {
      return Promise.reject(new Error('invalide line param'));
    }

    const subnatureName = line[pyramidFields.staffType];
    const portfolioName = line[pyramidFields.portfolio];
    const subtypologyName = line[pyramidFields.activityPlan];
    const projectCode = line[pyramidFields.ProjectCode];

    const month = moment(Date.now())
      .subtract(1, 'month')
      .format('MM');

    const actualPeriodAppSettings = await this.getActualLastPeriodAppSettings(month);

    if (!actualPeriodAppSettings) {
      throw new Error('period not found');
    }

    const service = await this.getServiceByPortfolioName(portfolioName);
    if (!service) {
      throw new Error('Service not found');
    }

    const subtypology = await this.getSubtypologyByName(subtypologyName);
    if (!subtypology) {
      throw new Error('subTypology not found');
    }

    const thirdparty = await this.getThirdpartyByName(line[pyramidFields.cds]);
    if (!thirdparty) {
      throw new Error('thirdparty not found');
    }

    const subservice = await this.findSubService(service, subtypology, projectCode);
    if (!subservice) {
      throw new Error('subservice not found');
    }

    const subnature = await this.subnatureService.findOne({ where: { name: subnatureName } });
    if (!subnature) {
      throw new Error('subNature not found');
    }

    const workloadsBySubserviceThirdpartySubnature = await this.findWorkloadBySubserviceThirdpartySubnature(subnature, subservice, thirdparty);
    if (!workloadsBySubserviceThirdpartySubnature.length) {
      throw new Error('workload not found');
    }

    workload = workloadsBySubserviceThirdpartySubnature[0];

    if (workloadsBySubserviceThirdpartySubnature.length > 1) {
      const subsidiaryAllocation = await this.getAllocationsByThirdparty(
        workloadsBySubserviceThirdpartySubnature,
        thirdparty,
        actualPeriodAppSettings,
      );
      if (!subsidiaryAllocation.workload) {
        throw new Error('workload not found by subsidiary allocations');
      }
      workload = subsidiaryAllocation.workload;
    }

    const actualPeriod = actualPeriodAppSettings.period;

    const prices = await this.pricesService.findOne({ where: { thirdparty: thirdparty.id, subnature: subnature.id, periodtype: actualPeriod.type } });
    const rate = await this.currencyRateService.getCurrencyRateByCountryAndPeriod(thirdparty.countryid, actualPeriod.id);

    if (!prices) {
      throw new Error('Price not found');
    }

    const costPrice = prices.price;
    const salePrice = prices.saleprice;

    const amountData = this.getAmountData(line);

    let createdAmount = this.amountConverter.createAmountEntity(parseFloat(amountData.amount), amountData.unit, rate.value, costPrice, salePrice);

    createdAmount = { ...createdAmount, workload: workload, period: actualPeriod };

    const existingAmount = await this.amountsService.findOne({ where: { period: actualPeriod, workload: workload } });
    if (existingAmount) {
      createdAmount.id = existingAmount.id;
      if (this.resourceManager.exists(workload.id.toString())) {
        createdAmount = this.amountConverter.sum(createdAmount, existingAmount);
      }
    }
    this.resourceManager.add(workload.id.toString());

    return this.amountsService.save(createdAmount, { reload: false });
  };
  end = () => {};
}
