import { Test, TestingModule } from '@nestjs/testing';
import { SubservicesService } from './subservices.service';

describe('SubservicesService', () => {
  let service: SubservicesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubservicesService],
    }).compile();

    service = module.get<SubservicesService>(SubservicesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
