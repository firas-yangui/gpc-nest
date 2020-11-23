import { Test, TestingModule } from '@nestjs/testing';
import { AmountsService } from './amounts.service';
import { AmountRepository } from './amounts.repository';
import { WorkloadsService } from '../workloads/workloads.service';
const saveMock = jest.fn();
const amountRepositoryMock = () => ({
  save: saveMock,
});
const mockWorkloadsService = () => ({});
describe('AmountsService', () => {
  let amountsService: AmountsService;
  let amountRepository: AmountRepository;
  let workloadsService: WorkloadsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AmountsService,
        {
          provide: AmountRepository,
          useFactory: amountRepositoryMock,
        },
        {
          provide: WorkloadsService,
          useFactory: mockWorkloadsService,
        },
      ],
    }).compile();

    amountsService = module.get<AmountsService>(AmountsService);
    amountRepository = module.get<AmountRepository>(AmountRepository);
    workloadsService = module.get<WorkloadsService>(WorkloadsService);
  });

  it('should be defined', () => {
    expect(amountsService).toBeDefined();
  });

  describe('the save function', () => {
    it('should call find from the repository', () => {
      expect(amountRepository.save).not.toHaveBeenCalled;
      amountsService.save({ workload: {}, period: {}, klocalcurrency: 0, keuros: 0, mandays: 0, keurossales: 0, status: 'DRAFT' });
      expect(amountRepository.save).toHaveBeenCalled;
    });

    it('should return value from the repository', async () => {
      expect(amountRepository.save).not.toHaveBeenCalled;
      saveMock.mockResolvedValue([]);
      const savedAmount = await amountsService.save({
        workload: {},
        period: {},
        klocalcurrency: 0,
        keuros: 0,
        mandays: 0,
        keurossales: 0,
        status: 'DRAFT',
      });
      expect(amountRepository.save).toHaveBeenCalled;
      expect(savedAmount).toEqual([]);
    });
  });
});
