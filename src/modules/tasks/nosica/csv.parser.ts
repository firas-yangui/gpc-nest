import { createReadStream, statSync, readdirSync } from 'fs';
import csvParser = require('csv-parser');
import { Injectable, Logger, Header } from '@nestjs/common';
import { map, sortBy } from 'lodash';

import { CallbackNosicaParser } from './callback.nosica.parser';
import { ThirdpartiesService } from './../../thirdparties/thirdparties.service';
import { SubnatureappsettingsService } from './../../subnatureappsettings/subnatureappsettings.service';
import { WorkloadsService } from './../../workloads/workloads.service';
import { PeriodsService } from './../../periods/periods.service';
import { AmountsService } from './../../amounts/amounts.service';
import { SubservicesService } from './../../subservices/subservices.service';

import { ThirdpartyRepository } from './../../thirdparties/thirdparties.repository';
import { SubNatureAppSettingsRepository } from './../../subnatureappsettings/subnatureappsettings.repository';
import { WorkloadRepository } from './../../workloads/workload.repository';
import { PeriodRepository } from './../../periods/period.repository';
import { AmountRepository } from './../../amounts/amounts.repository';
import { SubServiceRepository } from './../../subservices/subservices.repository';

@Injectable()
export class CsvParser {
  constructor(
    private readonly callbackNosicaParser: CallbackNosicaParser,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly subnatureappsettingsService: SubnatureappsettingsService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly amountsService: AmountsService,
    private readonly subservicesService: SubservicesService,
  ) {
    thirdpartiesService = new ThirdpartiesService(new ThirdpartyRepository());
    subnatureappsettingsService = new SubnatureappsettingsService(new SubNatureAppSettingsRepository());
    periodsService = new PeriodsService(new PeriodRepository());
    amountsService = new AmountsService(new AmountRepository());
    subservicesService = new SubservicesService(new SubServiceRepository());
    workloadsService = new WorkloadsService(new WorkloadRepository(), thirdpartiesService, subservicesService, periodsService);
    callbackNosicaParser = new CallbackNosicaParser(
      thirdpartiesService,
      subnatureappsettingsService,
      workloadsService,
      periodsService,
      amountsService,
    );
  }
  private results = [];
  private separator = '|@|';

  private parseCsvFile = (filePath, options) => {
    Logger.log(`start parsing file: ${filePath} with options: ${JSON.stringify(options)}`);

    const fileNames = readdirSync(filePath, { encoding: 'utf8' });

    const filesInDirectory = map(fileNames, fileName => {
      if (statSync(filePath + fileName).isFile()) {
        return {
          name: fileName,
          time: statSync(filePath + '/' + fileName).mtime.getTime(),
        };
      }
    });

    const sortedFiles = sortBy(filesInDirectory.filter(Boolean), 'time');

    Logger.log(`Files found in the directory: ${filePath} are: ${JSON.stringify(sortedFiles)} sorted by timestamp`);
    const file = sortedFiles[0].name;

    Logger.log(`Selected file: ${filePath}${file}`);

    createReadStream(`${filePath}${file}`)
      .pipe(csvParser({ separator: options.separator }))
      .on('data', data => {
        this.callbackNosicaParser.nosicaCallback(data);
        this.results.push(data);
      })
      .on('end', () => {
        Logger.log(`end, receiving data`);
      });
  };

  parseNosicaFile = (filePath: string) => {
    return this.parseCsvFile(filePath, { separator: this.separator, headers: false });
  };
}
