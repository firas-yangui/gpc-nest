import { Test, TestingModule } from '@nestjs/testing';
import { SubnatureappsettingsService } from './subnatureappsettings.service';

describe('SubnatureappsettingsService', () => {
  let service: SubnatureappsettingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SubnatureappsettingsService],
    }).compile();

    service = module.get<SubnatureappsettingsService>(SubnatureappsettingsService);
  });

  it.skip('should be defined', () => {
    expect(service).toBeDefined();
  });
});
