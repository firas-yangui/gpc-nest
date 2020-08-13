import csvParser = require('csv-parser');
import { Injectable, Logger } from '@nestjs/common';
import * as stringToStream from 'string-to-stream';

import { CallbackNosicaParser } from './callback.nosica.parser';
import { ThirdpartiesService } from './../../thirdparties/thirdparties.service';
import { SubnatureappsettingsService } from './../../subnatureappsettings/subnatureappsettings.service';
import { WorkloadsService } from './../../workloads/workloads.service';
import { PeriodsService } from './../../periods/periods.service';
import { PricesService } from './../../prices/prices.service';
import { AmountsService } from './../../amounts/amounts.service';
import { SubservicesService } from './../../subservices/subservices.service';
import { ServicesService } from './../../services/services.service';
import { ConstantService } from './../../constants/constants';
import { CurrencyRateService } from './../../currency-rate/currency-rate.service';

import { ThirdpartyRepository } from './../../thirdparties/thirdparties.repository';
import { SubNatureAppSettingsRepository } from './../../subnatureappsettings/subnatureappsettings.repository';
import { WorkloadRepository } from './../../workloads/workload.repository';
import { PeriodRepository } from './../../periods/period.repository';
import { AmountRepository } from './../../amounts/amounts.repository';
import { AmountConverter } from './../../amounts/amounts.converter';
import { PriceRepository } from './../../prices/prices.repository';
import { CurrencyRateRepository } from './../../currency-rate/currency-rate.repository';

import { SubServiceRepository } from './../../subservices/subservices.repository';

@Injectable()
export class NosicaParser {
  private readonly logger = new Logger(NosicaParser.name);

  constructor(
    private readonly callbackNosicaParser: CallbackNosicaParser,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly amountsService: AmountsService,
    private readonly servicesService: ServicesService,
    private readonly subservicesService: SubservicesService,
    private readonly constantService: ConstantService,
    private readonly amountConverter: AmountConverter,
    private readonly pricesService: PricesService,
    private readonly currencyRateService: CurrencyRateService,
  ) {
    thirdpartiesService = new ThirdpartiesService(new ThirdpartyRepository());
    subnatureappsettingsService = new SubnatureappsettingsService(new SubNatureAppSettingsRepository());
    periodsService = new PeriodsService(new PeriodRepository());
    amountsService = new AmountsService(new AmountRepository());
    subservicesService = new SubservicesService(new SubServiceRepository());
    workloadsService = new WorkloadsService(new WorkloadRepository(), thirdpartiesService, servicesService, subservicesService, periodsService);
    amountConverter = new AmountConverter(constantService);
    pricesService = new PricesService(new PriceRepository());
    currencyRateService = new CurrencyRateService(new CurrencyRateRepository(), thirdpartiesService);
    callbackNosicaParser = new CallbackNosicaParser(
      thirdpartiesService,
      subnatureappsettingsService,
      workloadsService,
      periodsService,
      amountsService,
      amountConverter,
      pricesService,
      currencyRateService,
      constantService,
    );
  }

  isHeader = (object: Record<string, any>): boolean => {
    for (const key in object) {
      const value = object[key];
      if (value === key) return true;
    }
    return false;
  };

  nosicaCallback = (data, separator) => this.callbackNosicaParser.nosicaCallback(data, separator);
  endNosicaCallback = () => this.callbackNosicaParser.endNosicaCallback();

  parseNosicaLine = (data: string) => {
    const separator = this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.SEPARATOR;
    const header = this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.HEADER;

    const readable = stringToStream(data);
    readable
      .pipe(
        csvParser({
          separator: separator,
          headers: header,
        }),
      )
      .on('data', parsedData => {
        if (!(parsedData == null || typeof parsedData === 'undefined' || this.isHeader(parsedData))) {
          Logger.log('Data to parse: ', JSON.stringify(parsedData));
          this.nosicaCallback(parsedData, separator);
        }
      });
  };
}
