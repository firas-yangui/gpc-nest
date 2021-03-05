import { Injectable } from '@nestjs/common';
import * as stringToStream from 'string-to-stream';
import * as csvParser from 'csv-parser';
import { CallbackMyGTSParser } from './callback.myGTS.parser';
import { ConstantService } from './../../constants/constants';
import { Helpers } from './../../../services/helpers';
import { Logger } from '@nestjs/common';

@Injectable()
export class MyGTSParser {
  private logger = new Logger(MyGTSParser.name);

  constructor(
    private readonly callbackMyGTSParser: CallbackMyGTSParser,
    private readonly constantService: ConstantService,
    private readonly helpers: Helpers,
  ) {}

  myGTSCallback = async (data, metadata: Record<string, any>) => await this.callbackMyGTSParser.parse(data, metadata);
  endmyGTSCallback = () => this.callbackMyGTSParser.end();

  parseMyGTSLine = async (data: string, metadata: Record<string, any>): Promise<string> => {
    const separator = this.constantService.GLOBAL_CONST.QUEUE.MYGTS_QUEUE.SEPARATOR;
    const header = this.constantService.GLOBAL_CONST.QUEUE.MYGTS_QUEUE.HEADER;

    const readable = stringToStream(data);
    return new Promise((resolve, reject) =>
      readable
        .pipe(
          csvParser({
            separator: separator,
            headers: header,
          }),
        )
        .on('data', async parsedData => {
          if (parsedData && !this.helpers.isHeader(parsedData)) {
            return resolve(parsedData);
          }
        })
        .on('error', error => reject(error)),
    );
  };
}
