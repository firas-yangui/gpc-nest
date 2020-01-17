import { Test, TestingModule } from '@nestjs/testing';
import { SubtypologiesService } from './subtypologies.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Subtypology } from './subtypology.entity';
import { Repository } from 'typeorm';

describe('SubtypologiesService', () => {
  let service: SubtypologiesService;
  let repository: Repository<Subtypology>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubtypologiesService,
        {
          provide: getRepositoryToken(Subtypology),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SubtypologiesService>(SubtypologiesService);
    repository = module.get<Repository<Subtypology>>(getRepositoryToken(Subtypology));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(repository).toBeDefined();
  });
});
