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

  async getCurrencyRateByThirdpartyAndPeriod(thirdpartyId, periodId) {
    const thirdParty = await this.thirdpartiesService.findOne({ id: thirdpartyId });
    if (!thirdParty) {
      Logger.error('thirdParty not found with id', thirdpartyId);
      return;
    }

    const currencyRate = await this.findOne({ country: thirdParty.countryid, period: periodId });
    if (!currencyRate) return { value: 1 };
    return currencyRate;
  }

  async getCurrencyRateByCountryAndPeriod(countryid, periodId) {
    const currencyRate = await this.findOne({ country: countryid, period: periodId });
    if (!currencyRate) return { value: 1 };
    return currencyRate;
  }
}
