import { Test, TestingModule } from '@nestjs/testing';
import { ThirdpartiesService } from './thirdparties.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Thirdparty } from './thirdparty.entity';
import { Repository } from 'typeorm';
describe('ThirdpartiesService', () => {
  let service: ThirdpartiesService;
  let repository: Repository<Thirdparty>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ThirdpartiesService,
        {
          provide: getRepositoryToken(Thirdparty),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<ThirdpartiesService>(ThirdpartiesService);
    repository = module.get<Repository<Thirdparty>>(getRepositoryToken(Thirdparty));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
