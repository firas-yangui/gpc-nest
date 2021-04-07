import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { SubService } from '../subservices/subservice.entity';
import { ServiceRepository } from './../services/services.repository';
import { Service } from './services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async find(options: { gpcAppSettingsId?: string }): Promise<Service[]> {
    try {
      const query = getConnection()
        .createQueryBuilder()
        .select('service')
        .from(Service, 'service')
        .leftJoin('service.serviceAppSettings', 'serviceAppSettings')
        .leftJoin('serviceAppSettings.gpcAppSettings', 'gpcAppSettings');

      if (options.gpcAppSettingsId) query.where('gpcAppSettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });

      return await query.getMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async findOne(options: object = {}): Promise<Service> {
    return await this.serviceRepository.findOne(options);
  }

  async getSubservices(options: { id: number }): Promise<SubService[]> {
    return await (await this.serviceRepository.findOne({ where: { id: options.id }, relations: ['subservices'] })).subservices;
  }

  async findByName(name: string): Promise<Service> {
    return await this.serviceRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();
  }
}
