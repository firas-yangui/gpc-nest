import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubServiceRepository } from './subservices.repository';
import { SubService } from './subservice.entity';
import { Workload } from '../workloads/workload.entity';
import { getManager } from 'typeorm';
import { AmountStat } from '../amountstats/amountstat.entity';

@Injectable()
export class SubservicesService {
  constructor(
    @InjectRepository(SubServiceRepository)
    private subServiceRepository: SubServiceRepository,
  ) {}

  async find(options: { gpcAppSettingsId?: string }): Promise<SubService[]> {
    try {
      const query = getManager()
        .createQueryBuilder()
        .select('subservice')
        .from(SubService, 'subservice')
        .innerJoin('subservice.service', 'service')
        .innerJoin('service.serviceAppSettings', 'serviceAppSettings')
        .innerJoin('serviceAppSettings.gpcAppSettings', 'gpcAppSettings');

      if (options.gpcAppSettingsId) query.where('gpcAppSettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });

      return await query.getMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async getSubservicesWithAmounts(options: { serviceId: number; periodId: number }): Promise<any> {
    try {
      const query = getManager()
        .createQueryBuilder()
        .from(AmountStat, 'amount')
        .select('amount.subserviceid', 'subserviceId')
        .addSelect('amount.periodId', 'periodId')
        .addSelect('SUM(amount.mandays)', 'mandays')
        .addSelect('SUM(amount.keuros)', 'keuros')
        .addSelect('SUM(amount.keurossales)', 'keurossales')
        .addSelect('SUM(amount.klocalcurrency)', 'klocalcurrency')

        .where('amount.periodid = :periodId', { periodId: +options.periodId })
        .andWhere('amount.serviceid = :serviceId', { serviceId: +options.serviceId });

      query.groupBy('amount.subserviceid').addGroupBy('amount.periodId');

      return await query.getRawMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async findOne(options: object = {}): Promise<SubService> {
    return await this.subServiceRepository.findOne(options);
  }

  async getWorkloads(options: { id: number }): Promise<Workload[]> {
    const query = getManager()
      .createQueryBuilder()
      .from(SubService, 'subservice')
      .select('workload.*')
      .addSelect('subnature.id', 'subnatureId')
      .addSelect('subnature.name', 'subnatureName')
      .addSelect('thirdparty.name', 'thirdpartyName')
      .innerJoin('subservice.workloads', 'workload')
      .innerJoin('workload.subnature', 'subnature')
      .innerJoin('workload.thirdparty', 'thirdparty')
      .where('subservice.id = :subserviceId', { subserviceId: options.id });

    return await query.execute();
  }

  async save(subService): Promise<SubService> {
    return await this.subServiceRepository.save(subService);
  }
}
