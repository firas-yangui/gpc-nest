import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PeriodRepository } from './period.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodType } from './../interfaces/common-interfaces';
import { Period } from './period.entity';
import { createQueryBuilder, Like } from 'typeorm';
import * as moment from 'moment';
import { Object } from 'lodash';

interface IfindOneInAppSettings {
  type: string;
  month: string;
  year: string;
}

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(PeriodRepository)
    private periodRepository: PeriodRepository,
  ) {}

  async findAndCount(): Promise<[Period[], number]> {
    return await this.periodRepository.findAndCount();
  }

  async find(options: object): Promise<Period[]> {
    return await this.periodRepository.find(options);
  }

  async findOne(options: object): Promise<Period> {
    return await this.periodRepository.findOne(options);
  }

  async findOneInAppSettings(appSettings: number, options: IfindOneInAppSettings): Promise<any> {
    return await createQueryBuilder('periodappsettings', 'pas')
      .leftJoinAndSelect('pas.period', 'p')
      .where('pas.gpcappsettingsid = :gpcappsettingsid', { gpcappsettingsid: appSettings })
      .andWhere('p.type = :type', { type: options.type })
      .andWhere('p.year = :year', { year: options.year })
      .andWhere('p.month = :month', { month: options.month })
      .getOne();
  }

  async getPeriodsByType(type: PeriodType): Promise<Period[]> {
    const period = await this.periodRepository.find({ type });
    if (!period) {
      throw new NotFoundException(`period with type ${type} not found`);
    }

    return period;
  }

  async getPeriodsByYearAndMonth(year: string = null, month: string = null): Promise<Period[]> {
    if (!year) {
      year = moment().format('YY');
    }
    if (!month) {
      month = moment().format('MM');
    }
    const periodName = [year, month].join('');
    // @Todo: filter periods by connected user appsettings to query
    const periods = await this.periodRepository.find({ where: { code: Like(`%${periodName}%`), isarchived: false } });
    if (!periods.length) {
      throw new NotFoundException(`No Period found for month ${month} and year ${year}`);
    }
    return periods;
  }
}
