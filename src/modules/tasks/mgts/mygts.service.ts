import { createWriteStream } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Like, In, Equal } from 'typeorm';
import { chain } from 'lodash';
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
import { SubService } from '../../subservices/subservice.entity';
import { ServiceDto } from '../../services/services.entity';
import { SubNature } from '../../subnature/subnature.entity';
import { SubtypologiesService } from '../../subtypologies/subtypologies.service';
import { ImportMappingService } from '../../importmapping/importmapping.service';

const REJECTED_FILENAME = `myGTS-rejected-preparedLines-${Date.now()}.csv`;
const writeStream = createWriteStream(`/tmp/${REJECTED_FILENAME}`);

@Injectable()
export class MyGtsService {
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
    private readonly subtypologiesService: SubtypologiesService,
    private readonly importMappingService: ImportMappingService,
  ) {}

  private writeInRejectedFile = (line: string, separator: string, error: string) => {
    writeStream.write(line.concat(separator, error));
  };

  /**
   * Prepare line for insertion
   * @param line
   */
  prepareLine = (line: Record<string, any>): any => {
    const headers = this.constantService.GLOBAL_CONST.QUEUE.MYGTS.HEADER;
    const CLIENT_PROJET = 'CLIENT PROJECT';
    const GTS_CLIENT_PROJECT = 'GTS - Client Projects';
    const GTS_HOSTING = 'GTS - Hosting + Client Request';
    let subnatureName, thirdPartyName;

    chain(headers)
      .pullAt([2])
      .forEach(header => {
        line[header] = line[header].trim();
        if (!line[header]) throw `${header} is required`;
      });

    if (line[headers[2]] == 'NRG0016') subnatureName = line[headers[4]] == CLIENT_PROJET ? GTS_CLIENT_PROJECT : GTS_HOSTING;
    else throw `${headers[2]} not equal to NRG0016: ${line[headers[2]]}`;

    if (line[headers[0]].startsWith('RESG/BSC'))
      thirdPartyName = chain(line[headers[0]])
        .split('/')
        .take(3)
        .concat('COO')
        .join('/')
        .value();
    else throw `${headers[0]} doesn't start with RESG/BSC :${line[headers[0]]}`;

    return {
      year: chain(line[headers[5]])
        .split('/')
        .last()
        .value(),
      month: chain(line[headers[5]])
        .split('/')
        .first()
        .value(),
      amount: parseFloat(line[headers[1]]),
      thirdPartyName,
      subnatureName,
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
    const subnature = await this.subnatureService.findByName(subnatureName);
    if (!subnature) {
      throw `subNature not found with name: "${subnatureName}"`;
    }

    return subnature;
  };

  getThirdParty = async (thirdPartyName: string): Promise<Thirdparty> => {
    const thirdParty = await this.thirdpartiesService.findOne({ name: Like(thirdPartyName) });
    if (!thirdParty) {
      throw `No Thirdparty found for name like : ${thirdPartyName}`;
    }
    return thirdParty;
  };

  getService = async (thirdParty: Thirdparty): Promise<ServiceDto> => {
    const MYGTS = 'MYGTS';
    const ORGA = 'ORGA';
    const service = await this.importMappingService.getMapping(MYGTS, ORGA, thirdParty.trigram);
    if (!service) throw `No service found for thirdparty: ${thirdParty.trigram}`;
    return service;
  };

  getSubservice = async (thirdparty: Thirdparty): Promise<SubService> => {
    const service = await this.getService(thirdparty);
    const subService = await this.subServiceService.findOne({
      where: { service: Equal(service.id), thirdpPartyId: Equal(thirdparty.id) },
    });
    if (!subService) {
      throw `No Subservice found for thirdPartyId:${thirdparty.id} and serviceId:${service.id}`;
    }
    return subService;
  };
  getWorkload = async (thirdPartyName: string, subnatureName: string): Promise<Workload> => {
    const thirdparty = await this.getThirdParty(thirdPartyName);
    const subnature = await this.getSubnature(subnatureName);
    const subservice = await this.getSubservice(thirdparty);

    let workload = await this.workloadsService.findOne({
      relations: ['subnature', 'thirdparty', 'subservice'],
      where: {
        subnature,
        thirdparty,
        subservice,
      },
    });

    if (!workload) {
      workload = await this.createWorkload(subnature, thirdparty, subservice).catch(() => {
        throw `Cannot create workload for subnature ID ${subnature.id}, subservice ID ${subservice.id}, thirdParty ID ${thirdparty.id}`;
      });
    }

    return workload;
  };

  createWorkload = async (subnature: SubNature, thirdparty: Thirdparty, subservice: SubService): Promise<Workload> => {
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
      const { year, month, amount, thirdPartyName, subnatureName } = this.prepareLine(line);
      const period = await this.getPeriod(year, month);
      const workload = await this.getWorkload(thirdPartyName, subnatureName);
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
