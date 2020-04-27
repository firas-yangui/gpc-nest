import { Test, TestingModule } from '@nestjs/testing';
import { SubnatureappsettingsController } from './subnatureappsettings.controller';

describe('Subnatureappsettings Controller', () => {
  let controller: SubnatureappsettingsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubnatureappsettingsController],
    }).compile();

    controller = module.get<SubnatureappsettingsController>(SubnatureappsettingsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
