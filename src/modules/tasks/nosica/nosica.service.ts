import { createWriteStream } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { Like } from 'typeorm';

import { ThirdpartiesService } from '../../thirdparties/thirdparties.service';
import { WorkloadsService } from '../../workloads/workloads.service';
import { SubnatureappsettingsService } from '../../subnatureappsettings/subnatureappsettings.service';
import { PeriodsService } from '../../periods/periods.service';
import { Thirdparty, PeriodType } from '../../interfaces/common-interfaces';
import { RawAmountsService } from '../../rawamounts/rawamounts.service';
import { PricesService } from '../../prices/prices.service';
import { CurrencyRateService } from '../../currency-rate/currency-rate.service';
import { ConstantService } from '../../constants/constants';
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
export class NosicaService {
  constructor(
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly rawAmountsService: RawAmountsService,
    private readonly amountConverter: AmountConverter,
    private readonly pricesService: PricesService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly constantService: ConstantService,
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

  import = async (filename, line: Record<string, any>): Promise<Record<string, any>> => {
    const receivedTrigram = this.cdsToCsm(line[nosicaField.trigram].trim());
    const receivedYear = line[nosicaField.year].trim();
    const receivedNRGCode = line[nosicaField.NRG].trim();
    const receivedMonth = line[nosicaField.period].trim();
    let amount = line[nosicaField.amount].trim();

    const actualPeriodAppSettings = await this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      year: receivedYear,
      month: receivedMonth,
      type: PeriodType.actual,
    });
    if (!actualPeriodAppSettings) throw `No Period found with year  ${receivedYear} and month ${receivedMonth} and type ${PeriodType.actual}`;

    const actualPeriod = actualPeriodAppSettings.period;

    if (!amount || !Number(amount)) throw `No amount defined for this line :${JSON.stringify(line)}`;
    amount = (amount * -1) / 1000;

    const thirdparty: Thirdparty = await this.thirdpartiesService.findOne({ name: Like(receivedTrigram) });
    if (!thirdparty) throw `No Thirdparty found for Trigram Code : ${receivedTrigram}`;

    const subnatureappsetting = await this.subnatureappsettingsService.findOne({
      where: { nrgcode: Like(`%${receivedNRGCode}%`), gpcappsettingsid: this.constantService.GLOBAL_CONST.SCOPES.BSC },
      relations: ['subnature'],
    });
    if (!subnatureappsetting) throw `No Subnature found with NRG Code : ${receivedNRGCode}`;

    const workload = await this.workloadsService.getNosicaWorkloadInSubserviceName(serviceName, thirdparty.id, subnatureappsetting.subnature.id);
    if (!workload)
      throw `No workload match with subnature ID ${subnatureappsetting.subnature.id} - nrgCode "${subnatureappsetting.nrgcode}" and thirdparty ID ${thirdparty.id} - Thirdparty Name "${thirdparty.name}"`;
    Logger.log(
      `Workload found with subnature ID ${subnatureappsetting.subnature.id} - nrgCode "${subnatureappsetting.nrgcode}" and thirdparty ID ${
        thirdparty.id
      } - Thirdparty Name "${thirdparty.name}": ${JSON.stringify(workload)}`,
    );

    const prices = await this.pricesService.getPricesFromWorkload(workload, actualPeriod.type);
    if (!prices) throw `Price not found with: ${workload.code} and period type ${actualPeriod.type}`;
    const rate = await this.currencyRateService.getCurrencyRateByThirdpartyAndPeriod(workload.thirdparty.id, actualPeriod.id);
    const GLOBAL_CONST = this.constantService.GLOBAL_CONST;
    const costPrice = prices.price;
    const salePrice = prices.saleprice;

    let createdAmount = this.amountConverter.createAmountEntity(parseFloat(amount), GLOBAL_CONST.AMOUNT_UNITS.KLC, rate.value, costPrice, salePrice);
    createdAmount = { ...createdAmount, datasource: filename };
    Logger.log(`amount saved with success for workload "${workload.code}" and period "${actualPeriod.code}"`);
    Logger.log(`The created amount ... ${JSON.stringify(createdAmount)}`);
    return this.rawAmountsService.save(createdAmount, workload, actualPeriod);
  };

  endNosicaCallback = () => {
    writeStream.end();
  };
}
