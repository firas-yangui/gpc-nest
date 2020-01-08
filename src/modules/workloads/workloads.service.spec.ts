import { Test, TestingModule } from '@nestjs/testing';
import { WorkloadsService } from './workloads.service';

describe('WorkloadsService', () => {
  let service: WorkloadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [WorkloadsService],
    }).compile();

    service = module.get<WorkloadsService>(WorkloadsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
