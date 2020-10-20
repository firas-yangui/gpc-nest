import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RawAmountRepository } from './rawamounts.repository';
import { RawAmount } from './../interfaces/common-interfaces';
import { ConstantService } from '../constants/constants';
@Injectable()
export class RawAmountsService {
  constructor(
    @InjectRepository(RawAmountRepository)
    private rawAmountRepository: RawAmountRepository,
    private constantService: ConstantService,
  ) {}

  async save(entities: RawAmount, options: any = {}) {
    return this.rawAmountRepository.save(entities, options);
  }

  async findOne(options: Record<string, any>): Promise<RawAmount | undefined> {
    return this.rawAmountRepository.findOne(options);
  }

  async find(options: Record<string, any>): Promise<RawAmount[] | undefined> {
    return this.rawAmountRepository.find(options);
  }

  async findWaitingFlows(): Promise<any | undefined> {
    return this.rawAmountRepository
      .createQueryBuilder()
      .select('MAX(created) AS created')
      .addSelect('datasource')
      .where(`created < now()::timestamp - interval '${this.constantService.GLOBAL_CONST.CRON_INTERVAL}'`)
      .groupBy('datasource')
      .execute();
  }
}
