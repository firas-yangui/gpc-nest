import { Test, TestingModule } from '@nestjs/testing';
import { RawAmountsService } from './rawamounts.service';
import { RawAmountRepository } from './rawamounts.repository';

const saveMock = jest.fn();
const rawamountRepositoryMock = () => ({
  save: saveMock,
});

describe('AmountsService', () => {
  let rawamountsService: RawAmountsService;
  let rawamountRepository: RawAmountRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RawAmountsService,
        {
          provide: RawAmountRepository,
          useFactory: rawamountRepositoryMock,
        },
      ],
    }).compile();

    rawamountsService = module.get<RawAmountsService>(RawAmountsService);
    rawamountRepository = module.get<RawAmountRepository>(RawAmountRepository);
  });

  it('should be defined', () => {
    expect(rawamountsService).toBeDefined();
  });

  describe('the save function', () => {
    it('should call find from the repository', () => {
      expect(rawamountRepository.save).not.toHaveBeenCalled;
      rawamountsService.save({ workloadid: 1, periodid: 1, klocalcurrency: 0, keuros: 0, mandays: 0, keurossales: 0, datasource: 'queue' });
      expect(rawamountRepository.save).toHaveBeenCalled;
    });

    it('should return value from the repository', async () => {
      expect(rawamountRepository.save).not.toHaveBeenCalled;
      saveMock.mockResolvedValue([]);
      const savedAmount = await rawamountsService.save({
        workloadid: 1,
        periodid: 1,
        klocalcurrency: 0,
        keuros: 0,
        mandays: 0,
        keurossales: 0,
        datasource: 'queue',
      });
      expect(rawamountRepository.save).toHaveBeenCalled;
      expect(savedAmount).toEqual([]);
    });
  });
});
