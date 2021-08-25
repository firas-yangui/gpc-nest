import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { SubService } from '../subservices/subservice.entity';
import { ServiceRepository } from './../services/services.repository';
import { ServiceDto } from './services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async find(options: { gpcAppSettingsId?: number }): Promise<ServiceDto[]> {
    const manager = getManager();
    try {
      const query = manager
        .createQueryBuilder()
        .select('service')
        .from(ServiceDto, 'service')
        .innerJoin('service.serviceAppSettings', 'serviceAppSettings')
        .innerJoin('serviceAppSettings.gpcAppSettings', 'gpcAppSettings');

      if (options.gpcAppSettingsId) query.where('gpcAppSettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });

      return await query.getMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async getServicesWithAmounts(options: { gpcAppSettingsId: number; periodId: number }): Promise<any> {
    const manager = getManager();
    try {
      const query = manager
        .createQueryBuilder()
        .from(ServiceDto, 'service')
        .select('service.id', 'serviceId')
        .addSelect('amount.periodId', 'periodId')
        .addSelect('SUM(amount.mandays)', 'mandays')
        .addSelect('SUM(amount.keuros)', 'keuros')
        .addSelect('SUM(amount.keurossales)', 'keurossales')
        .addSelect('SUM(amount.klocalcurrency)', 'klocalcurrency')
        .innerJoin('service.serviceAppSettings', 'serviceAppSettings')
        .innerJoin('serviceAppSettings.gpcAppSettings', 'gpcAppSettings')
        .innerJoin('service.amountStats', 'amount')
        .where('amount.periodid = :periodId', { periodId: +options.periodId });

      if (options.gpcAppSettingsId) query.andWhere('gpcAppSettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });

      query.groupBy('service.id').addGroupBy('amount.periodId');

      return await query.getRawMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async findOne(options: object = {}): Promise<ServiceDto> {
    return await this.serviceRepository.findOne(options);
  }

  async getSubservices(options: { id: number }): Promise<SubService[]> {
    const query = getManager()
      .createQueryBuilder()
      .from(SubService, 'subservice')
      .select('subservice.*')
      .addSelect('subtypologyappsettings.plan', 'plan')
      .addSelect('irtApplication.codeirt', 'codeirt')
      .innerJoin('subservice.subtypology', 'subtypology')
      .innerJoin('subtypology.subTypologyAppSettings', 'subtypologyappsettings')
      .innerJoin('subservice.service', 'service')
      .leftJoin('subservice.irtApplication', 'irtApplication')
      .where('service.id = :serviceId', { serviceId: options.id });

    return await query.execute();
  }

  async findByName(name: string): Promise<ServiceDto> {
    return await this.serviceRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();
  }
}
