import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityThirdPartyRepository } from './activity-thirdparty.repository';
import { ActivityThirdParty } from './activity-thirdparty.entity';
import { ActivityService } from '../activity/activity.service';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { ActivityThirdPartyDto } from './activity-thirdparty.dto';
import { ThirdPartyPercentage } from './thirdParty-percentage.dto';
import * as _ from 'lodash';
import { ERRORS } from '../exceptions-handler/errors.constants';
import { SUCCESS } from '../success-handler/success.constatns';

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
    return await this.activityThirdPartyRepository.findOne(options);
  }

  async find(options: Record<string, any> = {}): Promise<ActivityThirdParty[]> {
    return this.activityThirdPartyRepository.find(options);
  }

  deleteActivityThirdPartyRepository = async (id: number): Promise<any> => {
    return await this.activityThirdPartyRepository
      .createQueryBuilder('activity_thirdparty')
      .delete()
      .where('id=:id', { id: id })
      .execute();
  };
  async update(id: number, percent: number): Promise<any> {
    const activityThirdParty = {
      percent: percent,
    };
    return await this.activityThirdPartyRepository.update({ id }, activityThirdParty);
  }
  async save(activity: object = {}): Promise<ActivityThirdParty> {
    return this.activityThirdPartyRepository.save(activity);
  }

  percentageValidation(partnerPercentages: Record<string, any>[]): boolean {
    const total = _.sumBy(partnerPercentages, partnerPercentage => partnerPercentage.percent);
    return total == 100 ? true : false;
  }

  async linkActivityToThirdParty(activityThirdPartyDto: ActivityThirdPartyDto): Promise<any> {
    try {
      const startDate = activityThirdPartyDto.getStartDate();
      const endDate = activityThirdPartyDto.getEndDate();
      const activityOptions = {
        where: {
          activityCode: activityThirdPartyDto.getActivity(),
        },
      };
      const activity = await this.activityService.findOne(activityOptions);
      if (!activity) {
        this.logger.log(ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION);
        return ERRORS.ACTIVITY_NOT_FOUND;
      }
      const thirdPartyPercentages = activityThirdPartyDto.getThirdPartyPercentages();
      for (const thirdPartyPercentage of thirdPartyPercentages) {
        const id = thirdPartyPercentage['thirdParty'] ? thirdPartyPercentage['thirdParty'] : null;
        const options = {
          where: {
            id,
          },
        };
        const thirdParty = await this.thirdpartiesService.findOne(options);
        if (!thirdParty) {
          this.logger.log(ERRORS.THIRDPARTY_NOT_FOUND.DESCRIPTION);
          return ERRORS.THIRDPARTY_NOT_FOUND;
        } else {
          const percent = thirdPartyPercentage['percent'];
          const activitythirdpartyEntity = {
            startDate,
            endDate,
            activity,
            thirdParty,
          };
          const options = {
            where: {
              ...activitythirdpartyEntity,
            },
          };
          const activitythirdpartyExists = await this.activityThirdPartyRepository.findOne(options);
          if (activitythirdpartyExists) {
            this.logger.log(activitythirdpartyExists);
            this.logger.log('ACTIVITY THIRDPARTY PERCENTAGE FOUND');
            const id = activitythirdpartyExists['id'];
            await this.activityThirdPartyRepository.save({
              id,
              percent,
              ...activitythirdpartyEntity,
            });
          } else {
            this.logger.log(activitythirdpartyExists);
            this.logger.log('ACTIVITY THIRDPARTY PERCENTAGE NOT FOUND');
            await this.activityThirdPartyRepository.save({
              percent,
              ...activitythirdpartyEntity,
            });
          }
        }
      }
      return SUCCESS.CREATE;
    } catch (error) {
      this.logger.log(error);
    }
  }
}
