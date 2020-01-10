import { Injectable, NotFoundException } from '@nestjs/common';
import { PeriodRepository } from './period.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PeriodType } from './../interfaces/common-interfaces';
import { Period } from './period.entity';

@Injectable()
export class PeriodsService {
  constructor(
    @InjectRepository(PeriodRepository)
    private periodRepository: PeriodRepository,
  ) {}

  async findAndCount(): Promise<[Period[], number]> {
    return await this.periodRepository.findAndCount();
  }

  async find(): Promise<Period[]> {
    return await this.periodRepository.find();
  }

  async getPeriodsByType(type: PeriodType): Promise<Period[]> {
    const period = await this.periodRepository.find({ type });
    if (!period) {
      throw new NotFoundException(`period with type ${type} not found`);
    }

    return period;
  }
}
