import { Test, TestingModule } from '@nestjs/testing';
import { DatalakeGpcOrganizationService } from './datalakegpcorganization.service';
import { DatalakeGpcOrganizationRepository } from './datalakegpcorganization.repository';
import { Repository } from 'typeorm';
import { DatalakeGpcOrganization } from './datalakegpcorganization.entity';

const mockDatalakeGpcOrganizationRepositoryFindMock = jest.fn();
const mockDatalakeGpcOrganizationRepository = () => ({
  findOne: mockDatalakeGpcOrganizationRepositoryFindMock,
});

describe('DatalakegpcorganizationService', () => {
  let service: DatalakeGpcOrganizationService;
  let repository: Repository<DatalakeGpcOrganization>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DatalakeGpcOrganizationService,
        {
          provide: DatalakeGpcOrganizationRepository,
          useFactory: mockDatalakeGpcOrganizationRepositoryFindMock,
        },
      ],
    }).compile();

    service = module.get<DatalakeGpcOrganizationService>(DatalakeGpcOrganizationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
