import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ActivityCapayorRepository } from './activity-capayor.repository';
import { ActivityService } from '../activity/activity.service';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { ActivityCapayor } from './activity-capayor.entity';
import { ActivityCapayorDto } from './activity-capayor.dto';
import { CapayorPercentage } from './capayorpercentage.dto';
import * as _ from 'lodash';
import { ERRORS } from '../exceptions-handler/errors.constants';
import { SUCCESS } from '../success-handler/success.constatns';
import { CaPayorService } from '../capayor/capayor.service';

@Injectable()
export class ActivityCapayorService {
  constructor(
    @InjectRepository(ActivityCapayorRepository)
    private readonly activityCapayorRepository: ActivityCapayorRepository,
    private readonly activityService: ActivityService,
    private readonly caPayorService: CaPayorService,
  ) {}

  private readonly logger = new Logger(ActivityCapayorService.name);

  async findOne(options: Record<string, any> = {}): Promise<ActivityCapayor> {
    return await this.activityCapayorRepository.findOne(options);
  }

  async find(options: Record<string, any> = {}): Promise<ActivityCapayor[]> {
    return this.activityCapayorRepository.find(options);
  }

  deleteactivityCapayorRepository = async (id: number): Promise<any> => {
    return await this.activityCapayorRepository
      .createQueryBuilder('activity_capayor')
      .delete()
      .where('id=:id', { id: id })
      .execute();
  };
  async update(id: number, percent: number): Promise<any> {
    const activitycapayor = {
      percent: percent,
    };
    return await this.activityCapayorRepository.update({ id }, activitycapayor);
  }
  async save(activity: object = {}): Promise<ActivityCapayor> {
    return this.activityCapayorRepository.save(activity);
  }

  percentageValidation(capayorPercentages: Record<string, any>[]): boolean {
    const groupedByPeriod = _.chain(capayorPercentages)
      .groupBy('startDate')
      .map((value, key) => ({ resource: value }))
      .value();
    let valide = true;
    _.forEach(groupedByPeriod, partnerPercentagesGrouped => {
      const total = _.sumBy(partnerPercentagesGrouped.resource, partnerPercentage => partnerPercentage.percent);
      valide = total == 100 ? true : false;
      if (!valide) return valide;
    });
    return valide;
  }

  async linkActivityTocapayor(activityCapayorDto: ActivityCapayorDto): Promise<any> {
    try {
      //const startDate = activitycapayorDto.getcapayorPercentages.;
      //const endDate = activitycapayorDto.getEndDate();
      const activityOptions = {
        where: {
          activityCode: activityCapayorDto.getActivity(),
        },
      };
      const activity = await this.activityService.findOne(activityOptions);
      if (!activity) {
        this.logger.log(ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION);
        return ERRORS.ACTIVITY_NOT_FOUND;
      }
      const capayorPercentages = activityCapayorDto.getCapayorPercentages();
      for (const capayorPercentage of capayorPercentages) {
        const deleteCondition = {
          startDate: capayorPercentage['startDate'],
          activity,
        };
        const activitycapayorExists = await this.activityCapayorRepository.find(deleteCondition);
        if (activitycapayorExists) {
          this.logger.log(activitycapayorExists);
          this.logger.log('ACTIVITY capayor PERCENTAGE FOUND');
          await this.activityCapayorRepository.delete(deleteCondition);
        }
      }
      for (const capayorPercentage of capayorPercentages) {
        const id = capayorPercentage['capayor'] ? capayorPercentage['capayor'] : null;
        const options = {
          where: {
            id,
          },
        };
        const capayor = await this.caPayorService.findOne(options);
        if (!capayor) {
          this.logger.log(ERRORS.CAPAYOR_NOT_FOUND.DESCRIPTION);
          return ERRORS.CAPAYOR_NOT_FOUND;
        } else {
          const percent = capayorPercentage['percent'];
          const startDate = capayorPercentage['startDate'];
          const endDate = new Date('12/31/2099');
          const activitycapayorEntity = {
            startDate,
            endDate,
            activity,
            capayor,
          };
          await this.activityCapayorRepository.save({
            percent,
            ...activitycapayorEntity,
          });
        }
      }
      return SUCCESS.CREATE;
    } catch (error) {
      this.logger.log(error);
    }
  }
}
