import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsService } from './periods.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Period } from './period.entity';
import { Repository } from 'typeorm';

describe('PeriodsService', () => {
  let service: PeriodsService;
  let repository: Repository<Period>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PeriodsService,
        {
          provide: getRepositoryToken(Period),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PeriodsService>(PeriodsService);
    repository = module.get<Repository<Period>>(getRepositoryToken(Period));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
