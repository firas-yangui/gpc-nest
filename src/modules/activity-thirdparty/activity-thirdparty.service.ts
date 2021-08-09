import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityThirdPartyRepository } from './activity-thirdparty.repository';

@Injectable()
export class ActivityThirdPartyService {
  constructor(
    @InjectRepository(ActivityThirdPartyRepository)
    private readonly activityThirdPartyRepository: ActivityThirdPartyRepository,
  ) {}
}
