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
    private readonly servicesService: ServicesService,
  ) {}

  private writeInRejectedFile = (line: string, separator: string, error: string) => {
    writeStream.write(line.concat(separator, error));
  };

  /**
   * Prepare line for insertion
   * @param line
   */
  prepareLine = (line: Record<string, any>): any => {
    const headers = this.constantService.GLOBAL_CONST.QUEUE.LICENCE_MAINTENANCE.HEADER;

    const MONTHS = ['12', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11'];
    const MAP = {
      'IT Rental and Mantenance': ['NRG0411', 'NRG0412', 'NRG0413', 'NRG0511', 'NRG0512', 'NRG0521', 'NRG0522', 'NRG1031'],
      'IT Depreciation': ['NRG0513', 'NRG0523', 'NRG0531', 'NRG0615'],
      WIP: ['NRG0171', 'NRG0341'],
    };
    const subnatureName = findKey(MAP, o => o.includes(line[headers[9]]));

    if (!subnatureName) throw `${headers[9]} no match in GPC: ${line[headers[9]]}`;

    const thirdPartyTrigram = chain(line[headers[8]])
      .split('/')
      .first()
      .value();
    return {
      year: new Date().getFullYear(),
      month: MONTHS[new Date().getMonth()],
      amount: (parseFloat(line[headers[12]]) * -1) / 1000,
      thirdPartyTrigram,
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
    const subnature = await this.subnatureService.findOne({ name: Like('%' + subnatureName + '%') });
    if (!subnature) {
      throw `subNature not found with name: "${subnatureName}"`;
    }

    return subnature;
  };

  getThirdParty = async (thirdPartyTrigram: string): Promise<Thirdparty> => {
    const thirdParty = await this.thirdpartiesService.findOne({ trigram: Like(thirdPartyTrigram) });
    if (!thirdParty) {
      throw `No Thirdparty found for trigram like : ${thirdPartyTrigram}`;
    }
    return thirdParty;
  };

  getWorkload = async (thirdPartyTrigram: string, subnatureName: string): Promise<Workload> => {
    const thirdparty = await this.getThirdParty(thirdPartyTrigram);
    const subnature = await this.getSubnature(subnatureName);

    let workload = await this.workloadsService.findOne({
      relations: ['subnature', 'thirdparty'],
      where: {
        subnature,
        thirdparty,
      },
    });

    if (!workload) {
      workload = await this.createWorkload(subnature, thirdparty).catch(err => {
        throw `Couldn't create Workload for subnature ID ${subnature.id},  thirdParty ID ${thirdparty.id} : ${err}`;
      });
    }
    return workload;
  };

  createWorkload = async (subnature: SubNature, thirdparty: Thirdparty): Promise<any> => {
    const THIRDPARTY_SERVICE_MAP = {
      AFMO_BSC: 'AFMO',
      ALDA: 'ALDA',
      AMER: 'AMER',
      ASIA: 'ASIA',
      ASSU_BSC: 'ASSU',
      BDDF: 'BDDF',
      BRS: 'BOURSORAMA',
      BSC_SOC: 'Activités Socle Commun',
      BSC_TRA: 'Transformation',
      CDN: 'CDN',
      CFT_AC: 'Activités Transverses',
      CFT_SOC: 'Activités Socle Commun',
      CFT_TRA: 'Transformation',
      COMM: 'Communication',
      CPLE: 'Conformité',
      DDS_AC: 'Activités Socle Commun',
      DDS_SOC: 'Activités Socle Commun',
      DDS_TRA: 'Transformation',
      DFIN: 'DFIN/Modèle Opérationnel',
      DGLE: 'Direction Générale',
      EURO_BSC: 'EURO',
      FRF: 'BDDF',
      GBSU: 'GBSU',
      GLBA: 'GLBA',
      GTPS: 'GTPS',
      HRCO: 'Ressources Humaines',
      IGAD: 'Audit et Inspection',
      ITIM: 'ITIM',
      MARK: 'MARK',
      NB25: 'VISION 2025',
      'RESG/ACH': 'RESG/Achats',
      'RESG/DIR': 'RESG/DIR',
      'RESG/GTS': 'RESG/Infrastructures Informatiques',
      'RESG/IMM': 'RESG/Immobilier',
      'RESG/SGC': 'SG CONSULTING',
      'RESG/TPS': 'RESG/TPS/GDO',
      RESG_AUT: 'RESG/DIR',
      RESG_EBS: 'SG EBS',
      RESG_GSC: 'SG GSC',
      RISQ: 'RISQ',
      RUSS_BSC: 'RUSS',
      SEGL: 'Secrétariat Général',
      SGEG_BSC: 'SGEF',
      SGSS: 'SGSS',
      TRS: 'Transactis',
      WAAM: 'WAAM',
    };
    const serviceName = THIRDPARTY_SERVICE_MAP[thirdparty.trigram] || 'unknown serviceName';
    const subService = await this.getSubservice(serviceName, thirdparty);

    const code: string = await this.workloadsService.generateCode('AUTO');

    return this.workloadsService.save({
      code: code,
      description: code,
      status: 'DRAFT',
      thirdparty,
      subnature,
      subService,
    });
  };

  getService = async (serviceName: string): Promise<Service> => {
    const service = await this.servicesService.findOne({ where: { name: Like('%' + serviceName + '%') } });
    if (!service) throw `No service found for ServiceName: ${serviceName}`;
    return service;
  };

  getSubservice = async (serviceName: string, thirdparty: Thirdparty): Promise<SubService> => {
    const service = await this.getService(serviceName);
    const subService = await this.subServiceService.findOne({
      where: { service: Equal(service.id), thirdpPartyId: Equal(thirdparty.id) },
    });
    if (!subService) throw `no Subservice found for thirdPartyId:${thirdparty.id} and serviceId:${service.id}`;
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
      const { year, month, amount, thirdPartyTrigram, subnatureName } = this.prepareLine(line);
      const period = await this.getPeriod(year, month);
      const workload = await this.getWorkload(thirdPartyTrigram, subnatureName);
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
