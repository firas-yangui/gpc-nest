import { Test, TestingModule } from '@nestjs/testing';
import { SubnatureService } from './subnature.service';

describe('SubnatureService', () => {
  let service: SubnatureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubnatureService],
    }).compile();

    service = module.get<SubnatureService>(SubnatureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
