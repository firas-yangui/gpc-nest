import { Test, TestingModule } from '@nestjs/testing';
import { SubservicesController } from './subservices.controller';

describe('Subservices Controller', () => {
  let controller: SubservicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubservicesController],
    }).compile();

    controller = module.get<SubservicesController>(SubservicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
