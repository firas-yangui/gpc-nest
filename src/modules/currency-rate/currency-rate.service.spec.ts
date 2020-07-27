import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRateService } from './currency-rate.service';

describe.skip('CurrencyRateService', () => {
  let service: CurrencyRateService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CurrencyRateService],
    }).compile();

    service = module.get<CurrencyRateService>(CurrencyRateService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
