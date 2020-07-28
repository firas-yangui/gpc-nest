import { Test, TestingModule } from '@nestjs/testing';
import { CurrencyRateController } from './currency-rate.controller';

describe('CurrencyRate Controller', () => {
  let controller: CurrencyRateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CurrencyRateController],
    }).compile();

    controller = module.get<CurrencyRateController>(CurrencyRateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
