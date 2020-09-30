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
  fae: 'RESG/BSC/FAE',
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

  private cdsToCsm = (cds: string) => {
    switch (cds) {
      case cdsType.coo:
        return cdsType.coo.concat('/PRF');
      case cdsType.fat:
        return cdsType.coo.concat('/PRF');
      case cdsType.fae:
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

  nosicaCallback = async (line: Record<string, any>, separator: string, metadata: Record<string, any>): Promise<Record<string, any>> => {
    const receivedTrigram = this.cdsToCsm(line[nosicaField.trigram].trim());
    const receivedYear = line[nosicaField.year].trim();
    const receivedNRGCode = line[nosicaField.NRG].trim();
    const receivedMonth = line[nosicaField.period].trim();
    let amount = line[nosicaField.amount].trim();
    let error = '';

    // is the first line after the header
    if (metadata.lineNumber == 1) {
      this.resourceManager.reset();
    }

    const actualPeriodAppSettings = await this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      year: receivedYear,
      month: receivedMonth,
      type: PeriodType.actual,
    });
    if (!actualPeriodAppSettings) {
      error = `No Period found with year  ${receivedYear} and month ${receivedMonth} and type ${PeriodType.actual}`;
      Logger.error(error);
      // reject all lines and exit
      return;
    }

    const actualPeriod = actualPeriodAppSettings.period;

    if (!amount || !Number(amount)) {
      error = `No amount defined for this line :${JSON.stringify(line)}`;
      Logger.error(error);
      // reject line
      return;
    }

    amount = (amount * -1) / 1000;

    const thirdparty: Thirdparty = await this.thirdpartiesService.findOne({ name: Like(receivedTrigram) });
    if (!thirdparty) {
      error = `No Thirdparty found for Trigram Code : ${receivedTrigram}`;
      Logger.error(error);
      // this.writeInRejectedFile(line, separator, error);
      return;
    }

    const subnatureappsetting = await this.subnatureappsettingsService.findOne({
      where: { nrgcode: Like(`%${receivedNRGCode}%`), gpcappsettingsid: this.constantService.GLOBAL_CONST.SCOPES.BSC },
      relations: ['subnature'],
    });
    if (!subnatureappsetting) {
      error = `No Subnature found with NRG Code : ${receivedNRGCode}`;
      Logger.error(error);
      return;
    }

    const workload = await this.workloadsService.getNosicaWorkloadInSubserviceName(serviceName, thirdparty.id, subnatureappsetting.subnature.id);
    if (!workload) {
      error = `No workload match with subnature ID ${subnatureappsetting.subnature.id} - nrgCode "${subnatureappsetting.nrgcode}" and thirdparty ID ${thirdparty.id} - Thirdparty Name "${thirdparty.name}"`;
      Logger.error(error);
      return;
    }
    Logger.log(
      `Workload found with subnature ID ${subnatureappsetting.subnature.id} - nrgCode "${subnatureappsetting.nrgcode}" and thirdparty ID ${
        thirdparty.id
      } - Thirdparty Name "${thirdparty.name}": ${JSON.stringify(workload)}`,
    );

    const prices = await this.pricesService.getPricesFromWorkload(workload, actualPeriod.type);
    const rate = await this.currencyRateService.getCurrencyRateByThirdpartyAndPeriod(workload.thirdparty.id, actualPeriod.id);
    const GLOBAL_CONST = this.constantService.GLOBAL_CONST;
    let costPrice = null;
    let salePrice = null;
    if (prices) {
      costPrice = prices.price;
      salePrice = prices.saleprice;
    } else {
      Logger.warn(`Price not found with: ${workload.code} and period type ${actualPeriod.type}`);
    }

    let createdAmount = this.amountConverter.createAmountEntity(parseFloat(amount), GLOBAL_CONST.AMOUNT_UNITS.KLC, rate.value, costPrice, salePrice);

    createdAmount = { ...createdAmount, workload: workload, period: actualPeriod };
    const existingAmount = await this.amountsService.findOne({ where: { period: actualPeriod, workload: workload } });
    if (existingAmount) {
      createdAmount.id = existingAmount.id;
      if (this.resourceManager.exists(workload.id.toString())) {
        createdAmount = this.amountConverter.sum(createdAmount, existingAmount);
      }
    }

    Logger.log(`amount saved with success for workload "${workload.code}" and period "${actualPeriod.code}"`);
    this.resourceManager.add(workload.id.toString());
    return this.amountsService.save(createdAmount, { reload: false });
  };

  endNosicaCallback = () => {
    writeStream.end();
  };
}
