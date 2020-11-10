import { Injectable } from '@nestjs/common';
import * as stringToStream from 'string-to-stream';
import * as csvParser from 'csv-parser';
import { CallbackPyramidParser } from './callback.pyramid.parser';
import { ConstantService } from './../../constants/constants';
import { Helpers } from './../../../services/helpers';
import { Logger } from '@nestjs/common';

@Injectable()
export class PyramidParser {
  private logger = new Logger(PyramidParser.name);

  constructor(
    private readonly callbackPyramidParser: CallbackPyramidParser,
    private readonly constantService: ConstantService,
    private readonly helpers: Helpers,
  ) {}

  pyramidCallback = async (data: string, metadata: Record<string, any>, isActuals = false) =>
    await this.callbackPyramidParser.parse(data, metadata, isActuals);
  endPyramidCallback = () => this.callbackPyramidParser.end();

  parsePramidLine = async (data: string, metadata: Record<string, any>, isActuals = false): Promise<string> => {
    this.logger.debug('parsePramidLine', data);
    const separator = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.SEPARATOR;
    const header = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.HEADER;

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
            this.logger.debug('parsed data: ', JSON.stringify(parsedData));
            return resolve(parsedData);
          }
        })
        .on('error', error => reject(error)),
    );
  };
}
