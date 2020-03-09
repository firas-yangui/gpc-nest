import { Test, TestingModule } from '@nestjs/testing';
import { ThirdpartiesController } from './thirdparties.controller';

describe.skip('Thirdparties Controller', () => {
  let controller: ThirdpartiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdpartiesController],
    }).compile();

    controller = module.get<ThirdpartiesController>(ThirdpartiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
