import { Test, TestingModule } from '@nestjs/testing';
import { AmountStatsService } from './amountstats.service';

describe.skip('AmountstatsService', () => {
  let service: AmountStatsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AmountStatsService],
    }).compile();

    service = module.get<AmountStatsService>(AmountStatsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
