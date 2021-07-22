import { createWriteStream } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Like, Equal } from 'typeorm';
import { chain, findKey } from 'lodash';
import { Thirdparty, PeriodType } from '../../interfaces/common-interfaces';
import { ConstantService } from '../../constants/constants';
import { AmountConverter } from '../../amounts/amounts.converter';
import { ThirdpartiesService } from '../../thirdparties/thirdparties.service';
import { WorkloadsService } from '../../workloads/workloads.service';
import { PeriodsService } from '../../periods/periods.service';
import { SubservicesService } from '../../subservices/subservices.service';
import { ServicesService } from '../../services/services.service';
import { RawAmountsService } from '../../rawamounts/rawamounts.service';
import { PricesService } from '../../prices/prices.service';
import { CurrencyRateService } from '../../currency-rate/currency-rate.service';
import { SubnatureService } from '../../subnature/subnature.service';
import { Workload } from '../../workloads/workload.entity';
import { Period } from '../../periods/period.entity';
import { Price } from '../../prices/prices.entity';
import { SubNature } from '../../subnature/subnature.entity';
import { SubService } from '../../subservices/subservice.entity';
import { Service } from '../../services/services.entity';
import { ImportMappingService } from '../../importmapping/importmapping.service';
import { SubnatureappsettingsService } from '../../subnatureappsettings/subnatureappsettings.service';
import moment = require('moment');

const REJECTED_FILENAME = `LicenceMaintenance-rejected-preparedLines-${Date.now()}.csv`;
const writeStream = createWriteStream(`/tmp/${REJECTED_FILENAME}`);

@Injectable()
export class LicenceMaintenanceService {
  constructor(
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly rawAmountsService: RawAmountsService,
    private readonly amountConverter: AmountConverter,
    private readonly pricesService: PricesService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly constantService: ConstantService,
    private readonly subnatureService: SubnatureService,
    private readonly subServiceService: SubservicesService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly importMappingService: ImportMappingService,
  ) {}

  private writeInRejectedFile = (line: string, separator: string, error: string) => {
    writeStream.write(line.concat(separator, error));
  };

  /**
   * Prepare line for insertion
   * @param line
   */
  prepareLine = async (line: Record<string, any>): Promise<any> => {
    const headers = this.constantService.GLOBAL_CONST.QUEUE.LICENCE_MAINTENANCE.HEADER;

    const subnatureappsetting = await this.subnatureappsettingsService.findOne({
      where: { nrgcode: Like(`%${line[headers[8]]}%`), gpcappsettingsid: this.constantService.GLOBAL_CONST.SCOPES.BSC },
      relations: ['subnature'],
    });
    if (!subnatureappsetting) throw `No Subnature found with NRG Code : ${line[headers[8]]}`;
    const payorTrigram = line[headers[11]]?.trim();
    const csmName = line[headers[10]]?.trim();
    return {
      year: moment()
        .subtract(1, 'month')
        .format('YYYY'),
      month: moment()
        .subtract(1, 'month')
        .format('MM'),
      amount: (parseFloat(line[headers[12]]) * -1) / 1000,
      csmName,
      payorTrigram,
      subnatureName: subnatureappsetting.subnature.name,
    };
  };

  getPeriod = async (year: string, month: string): Promise<Period> => {
    const actualPeriodAppSettings = await this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      year,
      month,
      type: PeriodType.actual,
    });

    if (!actualPeriodAppSettings) {
      throw `No Period found with year ${year} and month ${month} and type ${PeriodType.actual}`;
    }

    return actualPeriodAppSettings.period;
  };

  getSubnature = async (subnatureName: string): Promise<SubNature> => {
    const subnature = await this.subnatureService.findOne({ name: Like('%' + subnatureName + '%') });
    if (!subnature) {
      throw `subNature not found with name: "${subnatureName}"`;
    }

    return subnature;
  };

  getThirdPartyByTrigram = async (thirdPartyTrigram: string): Promise<Thirdparty> => {
    const thirdParty = await this.thirdpartiesService.findOne({ trigram: Like('%' + thirdPartyTrigram + '%') });
    if (!thirdParty) {
      throw `No Thirdparty found for trigram like : ${thirdPartyTrigram}`;
    }
    return thirdParty;
  };

  getThirdPartyByName = async (thirdpartyName: string): Promise<Thirdparty> => {
    const thirdParty = await this.thirdpartiesService.findOne({ name: Like('%' + thirdpartyName + '%') });
    if (!thirdParty) {
      throw `No Thirdparty found for name like : ${thirdpartyName}`;
    }
    return thirdParty;
  };

  getWorkload = async (csmName: string, subnatureName: string, payorTrigram: string): Promise<Workload> => {
    const thirdparty = await this.getThirdPartyByName(csmName);
    const subnature = await this.getSubnature(subnatureName);
    const subservice = await this.getSubservice(payorTrigram);

    let workload = await this.workloadsService.findOne({
      relations: ['subnature', 'thirdparty', 'subservice'],
      where: {
        subnature,
        thirdparty,
        subservice,
      },
    });

    if (!workload) {
      workload = await this.createWorkload(subnature, thirdparty, subservice).catch(err => {
        throw `Couldn't create Workload for subnature ID ${subnature.id},  thirdParty ID ${thirdparty.id} : ${err}`;
      });
    }
    return workload;
  };

  createWorkload = async (subnature: SubNature, thirdparty: Thirdparty, subservice: SubService): Promise<any> => {
    const code: string = await this.workloadsService.generateCode('AUTO');

    return this.workloadsService.save({
      code: code,
      description: code,
      status: 'DRAFT',
      thirdparty,
      subnature,
      subservice,
    });
  };

  getService = async (payor: Thirdparty): Promise<Service> => {
    const LICENCE_MAINTENANCE = 'LICENCE & MAINTENANCE';
    const ORGA = 'ORGA';
    const service = await this.importMappingService.getMapping(LICENCE_MAINTENANCE, ORGA, payor.trigram);
    if (!service) throw `No service found for thirdparty: ${payor.trigram}`;
    return service;
  };

  getSubservice = async (payorTrigram: string): Promise<SubService> => {
    const payor = await this.getThirdPartyByTrigram(payorTrigram);
    const service = await this.getService(payor);
    const subService = await this.subServiceService.findOne({
      where: { service, thirdparty: payor },
    });
    if (!subService) throw `no Subservice found for payorId:${payor.id} and serviceId:${service.id}`;
    return subService;
  };

  getRate = async (thirdPartyId: number, periodId: number): Promise<any> => {
    const rate = await this.currencyRateService.getCurrencyRateByThirdpartyAndPeriod(thirdPartyId, periodId);
    if (!rate) throw `no Rate found for thirdPartyId: ${thirdPartyId} and periodId: ${periodId}`;
    return rate;
  };

  getPrices = async (workload: Workload, type: string): Promise<Price> => {
    const prices = await this.pricesService.getPricesFromWorkload(workload, type);
    if (!prices) throw `no Prices found for workload: ${workload.id} and type: ${type}`;
    return prices;
  };

  createAmount = async (amount: number, workload: Workload, period: Period): Promise<any> => {
    const unit = this.constantService.GLOBAL_CONST.AMOUNT_UNITS.KLC;
    const rate = await this.getRate(workload.thirdparty.id, period.id);
    const prices = await this.getPrices(workload, period.type);
    return this.amountConverter.createAmountEntity(amount, unit, rate?.value, prices?.price, prices?.saleprice);
  };

  import = async (filename: string, line: Record<string, any>): Promise<Record<string, any>> => {
    try {
      const { year, month, amount, csmName, subnatureName, payorTrigram } = await this.prepareLine(line);
      const period = await this.getPeriod(year, month);
      const workload = await this.getWorkload(csmName, subnatureName, payorTrigram);
      let createdAmount = await this.createAmount(amount, workload, period);
      createdAmount = { ...createdAmount, datasource: filename };
      Logger.log(`amount saved with success for workload "${workload.code}" and period "${period.code}"`);
      Logger.log(`The created amount ... ${JSON.stringify(createdAmount)}`);
      return this.rawAmountsService.save(createdAmount, workload, period);
    } catch (error) {
      this.writeInRejectedFile(JSON.stringify(line), ';', error.toString());
      throw error;
    }
  };

  end = () => {
    writeStream.end();
  };
}
