import { AmountConverter } from '../../amounts/amounts.converter';
import { ConstantService } from '../../constants/constants';
import { CurrencyRateService } from '../../currency-rate/currency-rate.service';
import { Logger } from '@nestjs/common';
import { Like } from 'typeorm';
import { PeriodsService } from '../../periods/periods.service';
import { PricesService } from '../../prices/prices.service';
import { RawAmountsService } from '../../rawamounts/rawamounts.service';
import { SubnatureappsettingsService } from '../../subnatureappsettings/subnatureappsettings.service';
import { ThirdpartiesService } from '../../thirdparties/thirdparties.service';
import { Thirdparty, PeriodType } from '../../interfaces/common-interfaces';
import { WorkloadsService } from '../../workloads/workloads.service';
import * as moment from 'moment';

import { keys } from 'lodash';
const fields = {
  csm: 'PRD : Sigle Prestataire',
  amount: 'PRD : Facture du mois',
  nrg: 'PRD : Rubrique Budgetaire',
  partner: 'PRD : Libellé CA N2 Client',
  period: 'OPE - Periode Comptable Application',
};
const serviceName = '%Activités Transverses BSC%';
export class ProductService {
  constructor(
    private readonly amountConverter: AmountConverter,
    private readonly constantService: ConstantService,
    private readonly currencyRateService: CurrencyRateService,
    private readonly rawAmountsService: RawAmountsService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly periodsService: PeriodsService,
    private readonly pricesService: PricesService,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly workloadsService: WorkloadsService,
  ) {}
  trimRequired = (line: Record<string, string>): Record<string, string> => {
    keys(fields).forEach(key => {
      line[fields[key]] = line[fields[key]].trim();
    });
    return line;
  };

  checkRequired = (line: Record<string, string>): boolean => {
    keys(fields).forEach(key => {
      if (!line[fields[key]]) return false;
    });

    return true;
  };

  import = async (filename: string, line: Record<string, string>): Promise<Record<string, any>> => {
    line = this.trimRequired(line);

    if (!this.checkRequired(line)) throw new Error('invalid line param');

    const date = moment(line[fields.period], 'YYYYMM');
    const year = date.format('YY');
    const month = date.format('MM');

    if (!date) throw `Invalid period in line`;
    const period = await this.periodsService.findOneInAppSettings(this.constantService.GLOBAL_CONST.SCOPES.BSC, {
      year,
      month,
      type: PeriodType.actual,
    });
    if (!period) throw new Error(`No Period found with year  ${year} and month ${month} and type ${PeriodType.actual}`);

    const thirdparty: Thirdparty = await this.thirdpartiesService.findOne({ name: Like(fields.csm) });
    if (!thirdparty) throw `thirdparty not found in line`;

    const subnature = await this.subnatureappsettingsService.findOne({
      where: { nrgcode: Like(`%${fields.nrg}%`), gpcappsettingsid: this.constantService.GLOBAL_CONST.SCOPES.BSC },
      relations: ['subnature'],
    });
    if (!subnature) throw `No Subnature found with NRG Code : ${fields.nrg}`;

    const workload = await this.workloadsService.getNosicaWorkloadInSubserviceName(serviceName, thirdparty.id, subnature.subnature.id);
    if (!workload)
      throw `No workload match with subnature ${subnature.subnature.name} and thirdparty ID ${thirdparty.id} - Thirdpartyname ${thirdparty.name}`;

    const prices = await this.pricesService.getPricesFromWorkload(workload, period.type);
    const rate = await this.currencyRateService.getCurrencyRateByThirdpartyAndPeriod(workload.thirdparty.id, period.period.id);
    if (!prices) throw `Price not found for thirdparty ${thirdparty.name} and subnature ${subnature.subnature.name}`;
    const GLOBAL_CONST = this.constantService.GLOBAL_CONST;
    const amount = +line[fields.amount] * -1;
    const createdAmount = this.amountConverter.createAmountEntity(amount, GLOBAL_CONST.AMOUNT_UNITS.KLC, rate.value, prices.price, prices.saleprice);
    return this.rawAmountsService.save({ ...createdAmount, datasource: filename }, workload, period.period);
  };
}
