import { Test, TestingModule } from '@nestjs/testing';
import { Like, Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

import { WorkloadsService } from './workloads.service';
import { Workload } from './workload.entity';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { SubservicesService } from '../subservices/subservices.service';
import { PeriodsService } from '../periods/periods.service';

const mockWorkloadRepositoryFindMock = jest.fn();
const mockSubservicesServiceFindOneMock = jest.fn();
const errorMock = jest.fn();

const mockWorkloadRepository = () => ({
  find: mockWorkloadRepositoryFindMock,
});
const mockThirdpartiesService = () => ({});
const mockSubservicesService = () => ({
  findOne: mockSubservicesServiceFindOneMock,
});
const mockPeriodsService = () => ({});
const mockLogger = () => ({
  error: errorMock,
});
describe('WorkloadsService', () => {
  let workloadsService: WorkloadsService;
  let workloadRepository: Repository<Workload>;
  let subservicesService: SubservicesService;
  let expectedWorkload;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WorkloadsService,
        {
          provide: WorkloadRepository,
          useFactory: mockWorkloadRepository,
        },
        {
          provide: ThirdpartiesService,
          useFactory: mockThirdpartiesService,
        },
        {
          provide: SubservicesService,
          useFactory: mockSubservicesService,
        },
        {
          provide: PeriodsService,
          useFactory: mockPeriodsService,
        },
      ],
    }).compile();

    workloadsService = module.get<WorkloadsService>(WorkloadsService);
    workloadRepository = module.get<WorkloadRepository>(WorkloadRepository);
    subservicesService = module.get<SubservicesService>(SubservicesService);
  });

  beforeEach(() => {
    expectedWorkload = { id: 1, name: 'w1' };
    mockWorkloadRepositoryFindMock.mockResolvedValue(expectedWorkload);
  });
  it('should be defined', () => {
    expect(workloadsService).toBeDefined();
    expect(workloadRepository).toBeDefined();
  });

  it('should call find from the repository', () => {
    expect(workloadRepository.find).not.toHaveBeenCalled();
    workloadsService.find({});
    expect(workloadRepository.find).toHaveBeenCalled();
  });

  it('should return the value from the repository', async () => {
    const res = await workloadsService.find({});

    expect(workloadRepository.find).toHaveBeenCalled();
    expect(res).toEqual(expectedWorkload);
  });

  describe('the getNosicaWorkloadInSubserviceName function', () => {
    const subserviceName = 'A_NOSICA_SUBSERVICE';
    const subService = { id: 1, name: 'a-sub-service-name' };

    beforeEach(async () => {
      mockSubservicesServiceFindOneMock.mockReturnValue(subService);
    });

    it('should find the subservice by name', async () => {
      expect(subservicesService.findOne).not.toHaveBeenCalled();
      // expect(workloadRepository.find).not.toHaveBeenCalled();
      const res = await workloadsService.getNosicaWorkloadInSubserviceName(subserviceName);

      expect(subservicesService.findOne).toHaveBeenCalledWith(null, { name: Like(subserviceName) });
    });

    it('should found the subservice', async () => {
      const res = await workloadsService.getNosicaWorkloadInSubserviceName(subserviceName);
      expect(mockSubservicesServiceFindOneMock.mock.results[0].value).toEqual(subService);
    });

    it('should find the workload with the right params', async () => {
      const expectedFindCallParams = {
        relations: ['subservice', 'subnature', 'thirdparty'],
        where: {
          description: Like('%NOS_TRANS%'),
          subService: {
            id: subService.id,
          },
        },
      };

      const res = await workloadsService.getNosicaWorkloadInSubserviceName(subserviceName);
      expect(workloadRepository.find).toHaveBeenCalledWith(expectedFindCallParams);
    });
  });
});
