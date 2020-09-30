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

  pyramidCallback = async (data: string, metadata: Record<string, any>) => await this.callbackPyramidParser.parse(data, metadata);
  endPyramidCallback = () => this.callbackPyramidParser.end();

  parsePramidLine = (data: string, metadata: Record<string, any>) => {
    const separator = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.SEPARATOR;
    const header = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.HEADER;

    const readable = stringToStream(data);
    readable
      .pipe(
        csvParser({
          separator: separator,
          headers: header,
        }),
      )
      .on('data', async parsedData => {
        if (!parsedData || this.helpers.isHeader(parsedData)) {
          this.logger.log('Data to parse: ', JSON.stringify(parsedData));
          try {
            const insertedData = await this.pyramidCallback(parsedData, metadata);
            this.logger.debug('inserted pyramid data: ', JSON.stringify(insertedData));
          } catch (error) {
            this.logger.error('error: ', error);
          }
        }
      });
  };
}
