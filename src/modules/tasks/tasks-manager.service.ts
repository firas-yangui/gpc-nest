import { Injectable, Logger } from '@nestjs/common';
import { NosicaService } from './nosica/nosica.service';
import { PyramidService } from './pyramid/pyramid.service';
import { MyGtsService } from './mgts/mygts.service';
import { ConstantService } from '../constants/constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import AWS = require('aws-sdk');
import * as csvParser from 'csv-parser';
import { map, includes, isString } from 'lodash';
import { ImportRejectionsHandlerService } from '../import-rejections-handler/import-rejections-handler.service';
import { RawAmountsService } from '../rawamounts/rawamounts.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as stringToStream from 'string-to-stream';
import path = require('path');
import { stringValue } from 'aws-sdk/clients/iot';

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
    private rejectionsHandlerService: ImportRejectionsHandlerService,
    private rawAmountsService: RawAmountsService,
    private readonly mailerService: MailerService,
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
            stream.pause();
            this.logger.error(`${filename} error occurred "${error}" on line ${JSON.stringify(parsed)}`);
            const line = { ...parsed, error };
            if (isString(error)) await this.rejectionsHandlerService.append(filename, line);
            stream.resume();
          }
        })
        .on('end', async () => {
          await this.sendRejectedFile(filename, flowType);
          resolve('end');
        })
        .on('error', err => reject(err));
    });
  }

  async sendRejectedFile(filename: string, flowType: string): Promise<boolean> {
    const rejectedFileName = `${filename}.REJECTED.csv`;
    const file = `/tmp/${rejectedFileName}`;
    if (existsSync(file)) {
      try {
        await this.mailerService.sendMail({
          to: this.constantService.GLOBAL_CONST.QUEUE[flowType].EMAIL_TO,
          subject: this.constantService.GLOBAL_CONST.QUEUE[flowType].EMAIL_SUBJECT,
          html: this.constantService.GLOBAL_CONST.QUEUE[flowType].EMAIL_BODY,
          attachments: [
            {
              filename: rejectedFileName,
              path: file,
              contentType: 'csv',
            },
          ],
        });
        Logger.log('rejected lines was sent by email');
        await unlinkSync(file);
        return Promise.resolve(true);
      } catch (error) {
        Logger.error(`Faild to send email with rejected line: ${error}`);
        Promise.resolve(false);
      }
    }
    Promise.resolve(false);
  }

  /**
   * This cron will be executed in a secure environment [HML, PRD]
   */
  @Cron(CronExpression.EVERY_30_MINUTES)
  async importFromS3() {
    if (!includes(secureEnvs, process.env.NODE_ENV)) return false;
    const inProgressImports = await this.rawAmountsService.findAll();
    if (inProgressImports.length) return false;
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
  async importFromLocal() {
    if (includes(secureEnvs, process.env.NODE_ENV)) return false;
    const inProgressImports = await this.rawAmountsService.findAll();
    if (inProgressImports.length) return false;
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
