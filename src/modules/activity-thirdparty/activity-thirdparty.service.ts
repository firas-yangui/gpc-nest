import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityThirdPartyRepository } from './activity-thirdparty.repository';
import { ActivityThirdParty } from './activity-thirdparty.entity';
import { ActivityService } from '../activity/activity.service';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { ActivityThirdPartyDto } from './activity-thirdparty.dto';
import { PartnerPercentage } from './partner-percentage.dto';
import * as _ from 'lodash';

@Injectable()
export class ActivityThirdPartyService {
  constructor(
    @InjectRepository(ActivityThirdPartyRepository)
    private readonly activityThirdPartyRepository: ActivityThirdPartyRepository,
    private readonly activityService: ActivityService,
    private readonly thirdpartiesService: ThirdpartiesService,
  ) {}

  private readonly logger = new Logger(ActivityThirdPartyService.name);

  async findOne(options: Record<string, any> = {}): Promise<ActivityThirdParty> {
    return this.activityThirdPartyRepository.findOne(options);
  }

  async find(options: Record<string, any> = {}): Promise<ActivityThirdParty[]> {
    return this.activityThirdPartyRepository.find(options);
  }

  async save(activity: object = {}): Promise<ActivityThirdParty> {
    return this.activityThirdPartyRepository.save(activity);
  }

  percentageValidation(partnerPercentages: Record<string, any>[]): boolean {
    const total = _.sumBy(partnerPercentages, partnerPercentage => partnerPercentage.percent);
    return total == 100 ? true : false;
  }
  // async addActivityThirdParty(ActivityThirdPartyDto): Promise<ActivityThirdParty[]> {
  //   return activityThirdParty = new ActivityThirdParty
  // }
}
