import { Test, TestingModule } from '@nestjs/testing';
import { WorkloadsController } from './workloads.controller';

describe('Workloads Controller', () => {
  let controller: WorkloadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkloadsController],
    }).compile();

    controller = module.get<WorkloadsController>(WorkloadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
