import { Test, TestingModule } from '@nestjs/testing';
import { AmountsController } from './amounts.controller';

describe('Amounts Controller', () => {
  let controller: AmountsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AmountsController],
    }).compile();

    controller = module.get<AmountsController>(AmountsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
