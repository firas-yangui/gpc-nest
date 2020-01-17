import { Test, TestingModule } from '@nestjs/testing';
import { SubtypologiesController } from './subtypologies.controller';

describe('subtypologies Controller', () => {
  let controller: SubtypologiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtypologiesController],
    }).compile();

    controller = module.get<SubtypologiesController>(SubtypologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
