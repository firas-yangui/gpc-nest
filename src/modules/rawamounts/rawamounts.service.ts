import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RawAmountRepository } from './rawamounts.repository';
import { RawAmount } from './../interfaces/common-interfaces';

@Injectable()
export class RawAmountsService {
  constructor(
    @InjectRepository(RawAmountRepository)
    private rawamountRepository: RawAmountRepository,
  ) {}

  async save(entities: RawAmount, options: any = {}) {
    return this.rawamountRepository.save(entities, options);
  }
}
