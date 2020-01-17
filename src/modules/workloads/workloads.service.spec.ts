import { Test, TestingModule } from '@nestjs/testing';
import { WorkloadsService } from './workloads.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Workload } from './workload.entity';
import { Repository } from 'typeorm';

describe.skip('WorkloadsService', () => {
  let service: WorkloadsService;
  let repository: Repository<Workload>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkloadsService,
        {
          provide: getRepositoryToken(Workload),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<WorkloadsService>(WorkloadsService);
    repository = module.get<Repository<Workload>>(getRepositoryToken(Workload));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
