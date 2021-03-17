import { Injectable, Logger } from '@nestjs/common';
import { NosicaService} from './nosica/nosica.service';
import { PyramidService } from './pyramid/pyramid.service';
import { MyGtsService } from './mgts/mygts.service';
import { ConstantService } from '../constants/constants';
import { Cron, CronExpression } from '@nestjs/schedule';
import AWS  = require('aws-sdk');
import * as csvParser from 'csv-parser';
import { map } from 'lodash';
import * as stringToStream from 'string-to-stream';

@Injectable()
export class TasksService  {
  private readonly logger = new Logger(TasksService.name);
  private S3 = new AWS.S3({apiVersion: '2006-03-01'});
  constructor(
    private nosicaService: NosicaService,
    private pyramidService: PyramidService,
    private constantService: ConstantService,
    private myGtsService: MyGtsService,
  ) {} 

  getFlowType(flow: string): string {
    const datas  = flow.split('.');
    if (datas.length !== 5 )  return undefined
    return datas[3];
  }

  importLine(flow, line) {
    switch (flow) {
      case this.constantService.GLOBAL_CONST.QUEUE.EAC.NAME:
        return this.pyramidService.import(line);
      case this.constantService.GLOBAL_CONST.QUEUE.PMD.NAME:
        return this.pyramidService.import(line, false, true);
      case this.constantService.GLOBAL_CONST.QUEUE.TM.NAME:
        return this.pyramidService.import(line, true);
      case this.constantService.GLOBAL_CONST.QUEUE.NOSICA.NAME:
        return this.nosicaService.import(line);
      case this.constantService.GLOBAL_CONST.QUEUE.MYGTS.NAME:
        return this.myGtsService.import(line);
    }
  }

  // @Cron(CronExpression.EVERY_10_SECONDS)
  async importFromS3() {
    const params: any = {
      Bucket: this.constantService.GLOBAL_CONST.S3_BUCKET.concat(process.env.NODE_ENV)
    };

    const objects: any = await this.S3.listObjects(params).promise();
    if(!objects || !objects.Contents.length) {
      this.logger.log(`No file found in S3 GPC bucket`); 
      return;
    }

    map(objects.Contents, async file => {
      const flow = file.Key;
      const flowType = this.getFlowType(flow);
      if(!flowType) return;
      if(!this.constantService.GLOBAL_CONST.QUEUE[flowType]) return;
      
      const s3object = (await this.S3.getObject({ Bucket: 'bsc-fin-fpm-gpc-a2870-development', Key: flow }).promise());
      const readable = stringToStream(s3object.Body.toString());
      const separator = this.constantService.GLOBAL_CONST.QUEUE[flowType].ORIGIN_SEPARATOR;  
      const _this = this;
      readable
      .pipe(csvParser({ separator: separator }))
      .on('data', async function(parsed) {
        _this.importLine(flowType, parsed)
        .catch((error) => _this.logger.error(`Pyramid EAC error occurred: ${error}`));
        
      })
      .on('end', async function(){
        // @todo: remove file from S3
        _this.logger.log('END');
      })
    });
  }
}
