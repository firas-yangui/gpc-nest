import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RawAmountRepository } from './rawamounts.repository';
import { RawAmount } from './../interfaces/common-interfaces';
import { ConstantService } from '../constants/constants';
import { Workload } from '../workloads/workload.entity';
import { Period } from '../periods/period.entity';
@Injectable()
export class RawAmountsService {
  constructor(
    @InjectRepository(RawAmountRepository)
    private rawAmountRepository: RawAmountRepository,
    private constantService: ConstantService,
  ) {}

  async save(amount: RawAmount, workload: Workload, period: Period) {
    amount = { ...amount, workloadid: workload.id, periodid: period.id };
    if (!workload.subnature.isworkforce) amount.mandays = 0;
    return await this.rawAmountRepository.save(amount);
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
      .select('datasource')
      .groupBy('datasource')
      .having(`MAX(created) < now()::timestamp - interval '$1' `, [this.constantService.GLOBAL_CONST.CRON_INTERVAL])
      .execute();
  }
}
