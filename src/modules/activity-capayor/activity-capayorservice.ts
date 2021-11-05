import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Not, Equal } from 'typeorm';
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
import * as moment from 'moment';
import { ConstantService } from '../constants/constants';
@Injectable()
export class ActivityCapayorService {
  constructor(
    @InjectRepository(ActivityCapayorRepository)
    private readonly activityCapayorRepository: ActivityCapayorRepository,
    private readonly activityService: ActivityService,
    private readonly caPayorService: CaPayorService,
    private readonly constantService: ConstantService,
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

  percentageValidation(capayorPercentages: Record<string, any>[]): [boolean, number?] {
    let res: [boolean, number?] = [true];
    const groupedByPeriod = _.chain(capayorPercentages)
      .groupBy('startDate')
      .map((value, key) => ({ resource: value }))
      .value();
    _.forEach(groupedByPeriod, partnerPercentagesGrouped => {
      const total: number = _.sumBy(partnerPercentagesGrouped.resource, partnerPercentage => partnerPercentage.percent);
      const roundTotal: number = Math.round(total * 100) / 100;
      if (roundTotal != 100) {
        res = [false, roundTotal];
      }
    });
    return res;
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
        this.logger.log(ERRORS.ACTIVITY_NOT_FOUND.DESCRIPTION + 'for ' + activityCapayorDto.getActivity());
        return ERRORS.ACTIVITY_NOT_FOUND + 'for ' + activityCapayorDto.getActivity();
      }
      const capayorPercentages = activityCapayorDto.getCapayorPercentages();
      for (const capayorPercentage of capayorPercentages) {
        /*
         * check if for the exactly same period we have data
         * delete it and replace it by new ones
         */

        const deleteCondition = {
          where: {
            startDate: capayorPercentage['startDate'],
            activity,
          },
        };
        const activitycapayorExists = await this.activityCapayorRepository.find(deleteCondition);
        if (activitycapayorExists) {
          this.logger.log(activitycapayorExists);
          this.logger.log('ACTIVITY capayor PERCENTAGE FOUND');
          await this.activityCapayorRepository.delete(deleteCondition['where']);
        }

        /*
         * check if for the we have data for the same acitivty in the past
         * update enddate then
         */

        const existCondition = {
          where: {
            startDate: LessThan(capayorPercentage['startDate']),
            endDate: Equal(new Date(this.constantService.MULTI_CA_END_DATE)),
            activity,
          },
        };
        const dataExitInthePast = await this.activityCapayorRepository.find(existCondition);
        if (dataExitInthePast) {
          _.forEach(dataExitInthePast, async capayorPercentageLine => {
            capayorPercentageLine['endDate'] = moment(capayorPercentage['startDate'], 'DD/MM/YYYY')
              .subtract(1, 'months')
              .endOf('month')
              .toDate();
            await this.activityCapayorRepository.save({
              ...capayorPercentageLine,
            });
          });
        }
      }
      for (const capayorPercentage of capayorPercentages) {
        const codeCaPayor = capayorPercentage['capayor'] ? capayorPercentage['capayor'] : null;
        const options = {
          where: {
            codeCaPayor,
          },
        };
        const capayor = await this.caPayorService.findOne(options);
        if (!capayor) {
          this.logger.log(ERRORS.CAPAYOR_NOT_FOUND.DESCRIPTION + ' for ' + codeCaPayor);
          return ERRORS.CAPAYOR_NOT_FOUND + ' for ' + codeCaPayor;
        } else {
          const percent = capayorPercentage['percent'];
          const startDate = capayorPercentage['startDate'];
          const endDate = new Date(this.constantService.MULTI_CA_END_DATE);
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
