import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubServiceRepository } from './subservices.repository';
import { SubService } from './subservice.entity';
import { Workload } from '../workloads/workload.entity';
import { getConnection } from 'typeorm';

@Injectable()
export class SubservicesService {
  constructor(
    @InjectRepository(SubServiceRepository)
    private subServiceRepository: SubServiceRepository,
  ) {}

  async find(options: { gpcAppSettingsId?: string }): Promise<SubService[]> {
    try {
      const query = getConnection()
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

    // return await this.subServiceRepository.find(options);
  }

  async findOne(options: object = {}): Promise<SubService> {
    return await this.subServiceRepository.findOne(options);
  }

  async getWorkloads(options: { id: number }): Promise<Workload[]> {
    return await (await this.subServiceRepository.findOne({ where: { id: options.id }, relations: ['workloads'] })).workloads;
  }

  async save(subService): Promise<SubService> {
    return await this.subServiceRepository.save(subService);
  }
}
