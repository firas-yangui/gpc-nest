import { Injectable, Logger } from '@nestjs/common';
import { NosicaService } from './nosica/nosica.service';
import { PyramidService } from './pyramid/pyramid.service';
import { MyGtsService } from './mgts/mygts.service';
import { ConstantService } from '../constants/constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { readFileSync, readdirSync } from 'fs';
import AWS = require('aws-sdk');
import * as csvParser from 'csv-parser';
import { map, includes } from 'lodash';
import * as stringToStream from 'string-to-stream';
import path = require('path');
import { on } from 'process';

const secureEnvs = ['homologation', 'production'];
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = '0';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  private S3 = new AWS.S3({ endpoint: process.env.AWS_BUCKET_ENDPOINT });
  constructor(
    private nosicaService: NosicaService,
    private pyramidService: PyramidService,
    private constantService: ConstantService,
    private myGtsService: MyGtsService,
  ) {}

  getFlowType(flow: string): string {
    const datas = flow.split('.');
    if (datas.length !== 5) return undefined;
    return datas[3];
  }

  importLine(filename, flow, line): Promise<any> {
    switch (flow) {
      case this.constantService.GLOBAL_CONST.QUEUE.EAC.NAME:
        return this.pyramidService.import(filename, line);
      case this.constantService.GLOBAL_CONST.QUEUE.PMD.NAME:
        return this.pyramidService.import(filename, line, false, true);
      case this.constantService.GLOBAL_CONST.QUEUE.TM.NAME:
        return this.pyramidService.import(filename, line, true);
      case this.constantService.GLOBAL_CONST.QUEUE.NOSICA.NAME:
        return this.nosicaService.import(filename, line);
      case this.constantService.GLOBAL_CONST.QUEUE.MYGTS.NAME:
        return this.myGtsService.import(filename, line);
    }
  }

  parseFile(buffer, filename): Promise<string> {
    const readable = stringToStream(buffer.toString());
    const flowType = this.getFlowType(filename);
    const separator = this.constantService.GLOBAL_CONST.QUEUE[flowType].ORIGIN_SEPARATOR;
    const stream = readable.pipe(csvParser({ separator: separator }));

    return new Promise((resolve, reject) => {
      stream
        .on('data', async parsed => {
          try {
            stream.pause();
            await this.importLine(filename, flowType, parsed);
            stream.resume();
          } catch (error) {
            this.logger.error(`${filename} error occurred: ${error}`);
            stream.resume();
          }
        })
        .on('end', () => resolve('end'))
        .on('finish', () => resolve('finish'))
        .on('error', err => reject(err));
    });
  }

  /**
   * This cron will be executed in a secure environment [HML, PRD]
   */
  @Cron(CronExpression.EVERY_MINUTE)
  async importFromS3() {
    if (!includes(secureEnvs, process.env.NODE_ENV)) return false;

    let params: any = {
      Bucket: `${process.env.AWS_BUCKET_PREFIX}gpc-set`,
    };

    const objects: any = await this.S3.listObjects(params).promise();
    if (!objects || !objects.Contents.length) {
      this.logger.log(`No file found in S3 GPC bucket`);
      return;
    }

    map(objects.Contents, async file => {
      const flow = file.Key;
      const flowType = this.getFlowType(flow);
      params = { ...params, Key: flow };

      if (!flowType) return;
      if (!this.constantService.GLOBAL_CONST.QUEUE[flowType]) return;

      const s3object = await this.S3.getObject(params).promise();
      const parsed = await this.parseFile(s3object.Body, flow);
      if (parsed) this.S3.deleteObject(params).promise();
    });
  }

  /**
   * This cron will be executed only in local environment
   */
  @Cron(CronExpression.EVERY_10_SECONDS)
  importFromLocal() {
    if (includes(secureEnvs, process.env.NODE_ENV)) return false;

    const receptiondir = `${__dirname}/../../set/reception`;
    const files = readdirSync(receptiondir, { withFileTypes: true }).filter(file => file.isFile());

    if (!files || !files.length) {
      this.logger.log(`No file found in reception dir`);
      return;
    }

    map(files, async file => {
      const lines = readFileSync(path.join(receptiondir, file.name));
      await this.parseFile(lines, file.name);
    });
  }
}
