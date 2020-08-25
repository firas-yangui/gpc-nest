import { Test, TestingModule } from '@nestjs/testing';
import { Like, Repository } from 'typeorm';
import { WorkloadsService } from './workloads.service';
import { Workload } from './workload.entity';
import { WorkloadRepository } from './workload.repository';
import { ThirdpartiesService } from '../thirdparties/thirdparties.service';
import { ServicesService } from '../services/services.service';
import { SubservicesService } from '../subservices/subservices.service';
import { PeriodsService } from '../periods/periods.service';

const mockWorkloadRepositoryFindMock = jest.fn();
const mockServicesServiceFindOneMock = jest.fn();
const mockSubservicesServiceFindOneMock = jest.fn();
const errorMock = jest.fn();

const mockWorkloadRepository = () => ({
  find: mockWorkloadRepositoryFindMock,
});
const mockThirdpartiesService = () => ({});
const mockServicesService = () => ({
  findOne: mockServicesServiceFindOneMock,
});
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
  let servicesService: ServicesService;
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
          provide: ServicesService,
          useFactory: mockServicesService,
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
    servicesService = module.get<ServicesService>(ServicesService);
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
    const service = {
      id: 1,
      name: 'a-service-name',
      subservices: [
        { id: 1, name: 'a-sub-service-name' },
        { id: 2, name: 'a-sub-service-name' },
      ],
    };
    const subService = { id: 1, name: 'a-sub-service-name' };
    beforeEach(async () => {
      mockServicesServiceFindOneMock.mockReturnValue(service);
      //mockSubservicesServiceFindOneMock.mockReturnValue(subService);
    });

    it('should find the subservice by name', async () => {
      expect(servicesService.findOne).not.toHaveBeenCalled();
      const res = await workloadsService.getNosicaWorkloadInSubserviceName(subserviceName);

      expect(servicesService.findOne).toHaveBeenCalledWith({ where: { name: Like(subserviceName) }, relations: ['subservices'] });
    });

    it('should found the subservice', async () => {
      const res = await workloadsService.getNosicaWorkloadInSubserviceName(subserviceName);
      expect(mockServicesServiceFindOneMock.mock.results[0].value).toEqual(service);
      //expect(mockSubservicesServiceFindOneMock.mock.results[0].value).toEqual(subService);
    });

    it('should find the workload with the right params', async () => {
      const expectedFindCallParams = {
        relations: ['subservice', 'subnature', 'thirdparty'],
        where: {
          description: Like('%NOS_TRANS%'),
          subService: {
            id: [1, 2],
          },
        },
      };

      const res = await workloadsService.getNosicaWorkloadInSubserviceName(subserviceName);
      expect(workloadRepository.find).toHaveBeenCalledWith(expectedFindCallParams);
    });
  });
});
