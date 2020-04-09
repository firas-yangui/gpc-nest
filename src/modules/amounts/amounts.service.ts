import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AmountRepository } from './amounts.repository';
import { Amount } from './../interfaces/common-interfaces';

@Injectable()
export class AmountsService {
  constructor(
    @InjectRepository(AmountRepository)
    private amountRepository: AmountRepository,
  ) {}

  async save(entities: Amount[], options: any = {}) {
    return this.amountRepository.save(entities, options);
  }
}
