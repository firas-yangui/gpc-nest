import { Test, TestingModule } from '@nestjs/testing';
import { SubsidiaryallocationService } from './subsidiaryallocation.service';

describe('SubsidiaryallocationService', () => {
  let service: SubsidiaryallocationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubsidiaryallocationService],
    }).compile();

    service = module.get<SubsidiaryallocationService>(SubsidiaryallocationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
