import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PriceRepository } from './prices.repository';
import { Workload } from './../workloads/workload.entity';
import { Price } from './prices.entity';

@Injectable()
export class PricesService {
  constructor(@InjectRepository(PriceRepository) private readonly priceRepository: PriceRepository) {}

  async findOne(options: Record<string, any>) {
    return await this.priceRepository.findOne(options);
  }

  async getPricesFromWorkload(workload: Workload, periodtype = 'actual'): Promise<Price> {
    return await this.findOne({ thirdparty: workload.thirdparty.id, subnature: workload.subnature.id, periodtype: periodtype });
  }
}
