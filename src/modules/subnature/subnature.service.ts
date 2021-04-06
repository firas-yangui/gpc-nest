import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection } from 'typeorm';
import { SubNature } from './subnature.entity';
import { SubNatureRepository } from './subnature.repository';
@Injectable()
export class SubnatureService {
  constructor(
    @InjectRepository(SubNatureRepository)
    private subNatureRepository: SubNatureRepository,
  ) {}

  async find(options: { gpcAppSettingsId?: string }): Promise<SubNature[]> {
    try {
      const query = getConnection()
        .createQueryBuilder()
        .select('subnature')
        .from(SubNature, 'subnature')
        .leftJoin('subnature.subnatureappsettings', 'subnatureappsettings')
        .leftJoin('subnatureappsettings.gpcappsettings', 'gpcappsettings');

      if (options.gpcAppSettingsId) query.where('gpcappsettings.id = :gpcAppSettingsId', { gpcAppSettingsId: +options.gpcAppSettingsId });

      return await query.getMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }

  async findOne(options: object = {}): Promise<SubNature> {
    return await this.subNatureRepository.findOne(options);
  }

  async findByName(name: string): Promise<SubNature> {
    return await this.subNatureRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();
  }
}
