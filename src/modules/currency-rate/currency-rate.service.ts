import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CurrencyRateRepository } from './currency-rate.repository';
import { CurrencyRate } from './currency-rate.entity';
import { ThirdpartiesService } from './../thirdparties/thirdparties.service';

@Injectable()
export class CurrencyRateService {
  constructor(
    @InjectRepository(CurrencyRateRepository)
    private currencyRateRepository: CurrencyRateRepository,
    private readonly thirdpartiesService: ThirdpartiesService,
  ) {}

  async findOne(options: Record<string, any>): Promise<CurrencyRate> {
    return await this.currencyRateRepository.findOne(options);
  }

  async getCurrencyRateFromWorkloadAndPeriod(workload, periodId) {
    const thirdParty = await this.thirdpartiesService.findOne({ id: workload.thirdparty.id });
    if (!thirdParty) {
      Logger.error('thirdParty not found with id', workload.thirdparty.id);
      return;
    }

    const currencyRate = await this.findOne({ country: thirdParty.countryid, period: periodId });
    if (!currencyRate) return { value: 1 };
    return currencyRate;
  }
}
