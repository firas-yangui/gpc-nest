import { Test, TestingModule } from '@nestjs/testing';
import { SubnatureController } from './subnature.controller';

describe('Subnature Controller', () => {
  let controller: SubnatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubnatureController],
    }).compile();

    controller = module.get<SubnatureController>(SubnatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
