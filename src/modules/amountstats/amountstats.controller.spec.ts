import { Test, TestingModule } from '@nestjs/testing';
import { AmountstatsController } from './amountstats.controller';
import { AmountStatsService } from './amountstats.service';

describe.skip('AmountstatsController', () => {
  let controller: AmountstatsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmountstatsController],
      providers: [AmountStatsService],
    }).compile();

    controller = module.get<AmountstatsController>(AmountstatsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
