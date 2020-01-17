import { Test, TestingModule } from '@nestjs/testing';
import { ThirdpartiesService } from './thirdparties.service';

describe('ThirdpartiesService', () => {
  let service: ThirdpartiesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ThirdpartiesService],
    }).compile();

    service = module.get<ThirdpartiesService>(ThirdpartiesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
