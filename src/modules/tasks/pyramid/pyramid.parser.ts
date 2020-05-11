import { createReadStream, statSync, readdirSync } from 'fs';
import csvParser = require('csv-parser');
import { Injectable, Logger } from '@nestjs/common';
import { map, sortBy } from 'lodash';

import { WorkloadsService } from '../../workloads/workloads.service';
import { CallbackPyramidParser } from './callback.pyramid.parser';
import { ThirdpartiesService } from '../../thirdparties/thirdparties.service';
import { PeriodsService } from '../../periods/periods.service';
import { SubservicesService } from '../../subservices/subservices.service';

import { ThirdpartyRepository } from '../../thirdparties/thirdparties.repository';
import { WorkloadRepository } from '../../workloads/workload.repository';
import { PeriodRepository } from '../../periods/period.repository';
import { SubServiceRepository } from '../../subservices/subservices.repository';

@Injectable()
export class PyramidParser {
  constructor(
    private readonly callbackPyramidParser: CallbackPyramidParser,
    private readonly thirdpartiesService: ThirdpartiesService,
    private readonly workloadsService: WorkloadsService,
    private readonly periodsService: PeriodsService,
    private readonly subservicesService: SubservicesService,
  ) {
    thirdpartiesService = new ThirdpartiesService(new ThirdpartyRepository());
    periodsService = new PeriodsService(new PeriodRepository());
    subservicesService = new SubservicesService(new SubServiceRepository());
    workloadsService = new WorkloadsService(new WorkloadRepository(), thirdpartiesService, subservicesService, periodsService);
    callbackPyramidParser = new CallbackPyramidParser(workloadsService);
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
        this.callbackPyramidParser.parse(data);
        this.results.push(data);
      })
      .on('end', () => {
        Logger.log(`end, receiving data`);
        this.callbackPyramidParser.end();
      });
  };

  parseNosicaFile = (filePath: string) => {
    return this.parseCsvFile(filePath, { separator: this.separator, headers: false });
  };
}
