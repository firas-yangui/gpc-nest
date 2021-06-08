import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager } from 'typeorm';
import { In } from 'typeorm';
import { SubtypologyRepository } from './subtypologies.repository';
import { Subtypology } from './subtypology.entity';

@Injectable()
export class SubtypologiesService {
  constructor(
    @InjectRepository(SubtypologyRepository)
    private subtypologyRepository: SubtypologyRepository,
  ) {}

  async findOne(options: object = {}): Promise<Subtypology> {
    return await this.subtypologyRepository.findOne(options);
  }

  async findByCodes(codes: string[]): Promise<Subtypology[]> {
    return await this.subtypologyRepository.find({ where: { code: In(codes) } });
  }

  async findEnrichedWithPlans(options: { gpcAppSettingsId?: string }): Promise<any> {
    try {
      const query = getManager()
        .createQueryBuilder()
        .select('subtypology.*')
        .addSelect('subtypologyappsettings.plan', 'plan')
        .from(Subtypology, 'subtypology')
        .leftJoin('subtypology.subTypologyAppSettings', 'subtypologyappsettings')
        .leftJoin('subtypologyappsettings.gpcappsettings', 'gpcappsettings');

      if (options.gpcAppSettingsId) query.where('gpcappsettings.id = :gpcAppSettingsId', { gpcAppSettingsId: parseInt(options.gpcAppSettingsId) });

      return await query.getRawMany();
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }
}
