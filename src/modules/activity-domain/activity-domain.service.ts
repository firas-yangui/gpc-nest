import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, getManager } from 'typeorm';
import { ActivityDomainRepository } from './activity-domain.repository';
import { ActivityDomain } from './activity-domain.entity';
import { Period } from '../periods/period.entity';

@Injectable()
export class ActivityDomainService {
  constructor(
    @InjectRepository(ActivityDomainRepository)
    private activityDomainRepository: ActivityDomainRepository,
  ) {}

  async find(gpcAppSettingsId: number): Promise<ActivityDomain[]> {
    try {
      return await createQueryBuilder()
        .from(ActivityDomain, 'ad')
        .select('ad.*')
        .leftJoin('ad.activityDomainAppSettings', 'ads')
        .where('ads.gpcappsettingsid = :gpcappsettingsid', { gpcappsettingsid: gpcAppSettingsId })
        .getRawMany();
    } catch (error) {
      Logger.error(error, 'ActivityDomainService');
      return [];
    }
  }
}
