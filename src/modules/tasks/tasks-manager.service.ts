import { Injectable, Logger } from '@nestjs/common';
import { NosicaService } from './nosica/nosica.service';
import { ProductService } from './nosica/product.service';
import { PyramidService } from './pyramid/pyramid.service';
import { MyGtsService } from './mgts/mygts.service';
import { LicenceMaintenanceService } from './licence_maintenance/licence_maintenance.service';
import { ConstantService } from '../constants/constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import { readFileSync, readdirSync, existsSync, unlinkSync } from 'fs';
import AWS = require('aws-sdk');
import * as csvParser from 'csv-parser';
import { map, includes, isEmpty, isString } from 'lodash';
import { ImportRejectionsHandlerService } from '../import-rejections-handler/import-rejections-handler.service';
import { AmountsService } from '../amounts/amounts.service';
import { RawAmountsService } from '../rawamounts/rawamounts.service';
import { MailerService } from '@nestjs-modules/mailer';
import * as stringToStream from 'string-to-stream';
import path = require('path');

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
    private licenceMaintenanceService: LicenceMaintenanceService,
    private productService: ProductService,
    private amountsService: AmountsService,
    private rawAmountsService: RawAmountsService,
    private rejectionsHandlerService: ImportRejectionsHandlerService,
    private readonly mailerService: MailerService,
  ) {}

  getFlowType(flow: string): string {
    const datas = flow.split('.');
    if (datas.length !== 5) return undefined;
    return datas[3].toUpperCase();
  }

  importLine(filename, flow, line): Promise<any> {
    switch (flow) {
      case this.constantService.GLOBAL_CONST.QUEUE.EACDEBUTMOIS.NAME:
        return this.pyramidService.import(filename, line);
      case this.constantService.GLOBAL_CONST.QUEUE.EACFINMOIS.NAME:
        return this.pyramidService.import(filename, line, false, false, true);
      case this.constantService.GLOBAL_CONST.QUEUE.PMD.NAME:
        return this.pyramidService.import(filename, line, false, true);
      case this.constantService.GLOBAL_CONST.QUEUE.TM.NAME:
        return this.pyramidService.import(filename, line, true);
      case this.constantService.GLOBAL_CONST.QUEUE.NOSICA.NAME:
        return this.nosicaService.import(filename, line);
      case this.constantService.GLOBAL_CONST.QUEUE.MYGTS.NAME:
        return this.myGtsService.import(filename, line);
      case this.constantService.GLOBAL_CONST.QUEUE.LICENCE_MAINTENANCE.NAME:
        return this.licenceMaintenanceService.import(filename, line);
      case this.constantService.GLOBAL_CONST.QUEUE.NOSICAPRD.NAME:
        return this.productService.import(filename, line);
    }
  }

  sleep(ms) {
    return new Promise(resolve => {
      setTimeout(resolve, ms);
    });
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
          await this.sleep(500); //sometime 'end' is fired before last line is fully parsed
          this.amountsService.synchronizeFromRawAmounts(filename);
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
  @Cron(process.env.NODE_ENV === 'homologation' ? CronExpression.EVERY_MINUTE : CronExpression.EVERY_30_MINUTES)
  async importFromS3() {
    this.logger.log(`Start Import from AWS S3`);
    if (!includes(secureEnvs, process.env.NODE_ENV)) {
      this.logger.log(`Not a secure environnement END Import from AWS S3`);
      return false;
    }

    let params: any = {
      Bucket: `${process.env.AWS_BUCKET_PREFIX}gpc-set`,
    };

    const objects: any = await this.S3.listObjects(params).promise();
    if (!objects || !objects.Contents.length) {
      this.logger.log(`No file found in S3 GPC bucket`);
      return;
    }

    this.logger.log(`found ${objects.Contents.length} files in S3: [${objects.Contents.map(({ Key }) => Key).join(', ')}]`);

    for await (const file of objects.Contents) {
      const flow = file.Key;
      let process = true;
      const flowType = this.getFlowType(flow);
      params = { ...params, Key: flow };
      const rejectedFile = `/tmp/${flow}.REJECTED.csv`;

      if (!flowType) {
        this.logger.log(`${flow} cannot get flowtype`);
        process = false;
      }
      if (!this.constantService.GLOBAL_CONST.QUEUE[flowType]) {
        this.logger.log(`${flowType} doesn't exist in GPC`);
        process = false;
      }
      if (existsSync(rejectedFile)) {
        this.logger.log(`${rejectedFile} already exist`);
        process = false;
      }
      const rawInProgress = await this.rawAmountsService.findOne({ datasource: flow });
      if (rawInProgress && !isEmpty(rawInProgress)) {
        this.logger.log(`${flow} is currently being processed`);
        process = false;
      }
      if (process) {
        const s3object = await this.S3.getObject(params).promise();
        this.logger.log(`${flow} start processing at ${Date.now().toString()}`);
        const parsed = await this.parseFile(s3object.Body, flow);
        this.logger.log(`${flow} processing finished at ${Date.now().toString()}`);
        if (parsed) {
          this.logger.log(`deleting ${flow}`);
          this.S3.deleteObject(params).promise();
        }
      } else {
        this.logger.log(`deleting ${flow}`);
        this.S3.deleteObject(params).promise();
      }
    }
    this.logger.log(`End Import from AWS S3`);
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
      const rejectedFile = `/tmp/${file.name}.REJECTED.csv`;
      if (existsSync(rejectedFile)) return;
      const rawInProgress = await this.rawAmountsService.findOne({ datasource: file.name });
      if (rawInProgress && !isEmpty(rawInProgress)) return;
      const lines = readFileSync(path.join(receptiondir, file.name));
      await this.parseFile(lines, file.name);
    });
  }
}
