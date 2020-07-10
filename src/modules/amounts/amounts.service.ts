import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmountRepository } from './amounts.repository';
import { Amount } from './../interfaces/common-interfaces';
import { FindOneOptions } from 'typeorm/find-options/FindOneOptions';

@Injectable()
export class AmountsService {
  constructor(
    @InjectRepository(AmountRepository)
    private amountRepository: AmountRepository,
  ) {}

  async save(entities: Amount, options: any = {}) {
    return this.amountRepository.save(entities, options);
  }

  async findOne(options: Record<string, any>): Promise<Amount | undefined> {
    return this.amountRepository.findOne(options);
  }
}
