import { Test, TestingModule } from '@nestjs/testing';
import { SubsidiaryallocationController } from './subsidiaryallocation.controller';

describe('Subsidiaryallocation Controller', () => {
  let controller: SubsidiaryallocationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubsidiaryallocationController],
    }).compile();

    controller = module.get<SubsidiaryallocationController>(SubsidiaryallocationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
