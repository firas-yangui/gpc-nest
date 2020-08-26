import { createWriteStream } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Like } from 'typeorm';

import { ResourceManager } from './resource-store';

import { ThirdpartiesService } from './../../../modules/thirdparties/thirdparties.service';
import { WorkloadsService } from './../../../modules/workloads/workloads.service';
import { SubnatureappsettingsService } from './../../../modules/subnatureappsettings/subnatureappsettings.service';
import { PeriodsService } from './../../../modules/periods/periods.service';
import { Thirdparty, PeriodType } from './../../../modules/interfaces/common-interfaces';
import { AmountsService } from './../../../modules/amounts/amounts.service';
import { PricesService } from './../../prices/prices.service';
import { CurrencyRateService } from './../../currency-rate/currency-rate.service';
import { ConstantService } from './../../constants/constants';
import { AmountConverter } from '../../amounts/amounts.converter';

const nosicaField = {
  trigram: 'cds',
  year: 'fiscal_year',
  period: 'accounting_period',
  NRG: 'code_snrg',
  amount: 'ytd_amount_eur_currency_wi_adjust',
};

const cdsType = {
  coo: 'RESG/BSC/COO',
  dir: 'RESG/BSC/DIR',
  fat: 'RESG/BSC/FAT',
  PRF: 'RESG/BSC/PRF',
};

const serviceName = '%Activités Transverses BSC%';
const rejectedFileName = `nosica-rejected-lines-${Date.now()}.csv`;
const writeStream = createWriteStream(`/tmp/${rejectedFileName}`);
@Injectable()
export class CallbackNosicaParser {
  constructor(
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly amountsService: AmountsService,
    private readonly amountConverter: AmountConverter,
    private readonly pricesService: PricesService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly constantService: ConstantService,
    private readonly resourceManager: ResourceManager,
  ) {}

  private getWorkloadByNrgAndSakarah = (nosicaWorkloads: any[], SubnaturId, thirdpartyId) => {
    return nosicaWorkloads.find(nosicaWorkload => {
      return nosicaWorkload.thirdparty.id === thirdpartyId && nosicaWorkload.subnature.id === SubnaturId;
    });
  };

  private cdsToCsm = (cds: string) => {
    switch (cds) {
      case cdsType.coo:
        return cdsType.coo.concat('/PRF');
      case cdsType.fat:
        return cdsType.coo.concat('/PRF');
      case cdsType.PRF:
        return cdsType.coo.concat('/PRF');
      case cdsType.dir:
        return cdsType.dir.concat('/DIR');
      default:
        return cds.concat('/COO');
    }
  };

  private writeInRejectedFile = (line: string, separator: string, error: string) => {
    writeStream.write(line.concat(separator, error));
  };

  nosicaCallback = async (line: Record<string, any>, separator: string, metadata: Record<string, any>) => {
    const receivedTrigram = this.cdsToCsm(line[nosicaField.trigram].trim());
    const receivedYear = line[nosicaField.year].trim();
    const receivedNRGCode = line[nosicaField.NRG].trim();
    const receivedMonth = line[nosicaField.period].trim();
    const amount = line[nosicaField.amount].trim();
    let error = '';

    const nosicaWorkloads = await this.workloadsService.getNosicaWorkloadInSubserviceName(serviceName);
    if (!nosicaWorkloads || !nosicaWorkloads.length) {
      error = 'No Nosica workload found in database, exit the script.';
      Logger.error(error);
      // this.writeInRejectedFile('Global rejection', separator, error);
      // writeStream.end();
      return;
    }

    const thirdparty: Thirdparty = await this.thirdpartiesService.findOne({ name: Like(receivedTrigram) });
    if (!thirdparty) {
      error = `No Thirdparty found for Trigram Code : ${receivedTrigram}`;
      Logger.error(error);
      // this.writeInRejectedFile(line, separator, error);
      return;
    }

    const subnatureappsetting = await this.subnatureappsettingsService.findOne({
      where: { nrgcode: Like(receivedNRGCode), gpcappsettingsid: 2 },
      relations: ['subnature'],
    });
    if (!subnatureappsetting) {
      error = `No Subnature found with NRG Code : ${receivedNRGCode}`;
      Logger.error(error);

      return;
    }

    const actualPeriod = await this.periodsService.findOne({ where: { year: receivedYear, month: receivedMonth, type: PeriodType.actual } });
    if (!actualPeriod) {
      error = `No Period found with year  ${receivedYear} and month ${receivedMonth} and type ${PeriodType.actual}`;
      Logger.error(error);

      return;
    }

    const workload = this.getWorkloadByNrgAndSakarah(nosicaWorkloads, subnatureappsetting.subnature.id, thirdparty.id);
    if (!workload) {
      error = `No workload match with subnature ID   ${subnatureappsetting.subnature.id} and thirdparty ID ${thirdparty.id}`;
      Logger.error(error);
      return;
    }

    const prices = await this.pricesService.getPricesFromWorkload(workload, actualPeriod.type);
    const rate = await this.currencyRateService.getCurrencyRateFromWorkloadAndPeriod(workload, actualPeriod.id);
    const GLOBAL_CONST = this.constantService.GLOBAL_CONST;
    let costPrice = null;
    let salePrice = null;
    if (prices) {
      costPrice = prices.price;
      salePrice = prices.saleprice;
    } else {
      Logger.warn(`Price not found with: ${JSON.stringify(workload)} and period type ${actualPeriod.type}`);
    }

    let createdAmount = this.amountConverter.createAmountEntity(
      parseInt(amount, 10),
      GLOBAL_CONST.AMOUNT_UNITS.KLC,
      rate.value,
      costPrice,
      salePrice,
    );

    const amountByPeriodAndWorkloadID = await this.amountsService.findOne({ period: actualPeriod, workload: workload });
    if (amountByPeriodAndWorkloadID) {
      createdAmount.id = amountByPeriodAndWorkloadID.id;
    }

    createdAmount.workload = workload;
    createdAmount.period = actualPeriod;

    if (metadata.isFirst) {
      this.resourceManager.reset();
    }

    if (!this.resourceManager.exists(workload)) {
      this.resourceManager.add(workload);
      return this.amountsService.save(createdAmount, { reload: false });
    }
    try {
      createdAmount = this.amountConverter.sum(createdAmount, amountByPeriodAndWorkloadID);
    } catch (error) {
      Logger.error(error);
      return;
    }
    return this.amountsService.save(createdAmount, { reload: false });
  };

  endNosicaCallback = () => {
    writeStream.end();
  };
}
