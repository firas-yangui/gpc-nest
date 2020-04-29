import { Test, TestingModule } from '@nestjs/testing';
import { ServicesService } from './services.service';
import { ServiceRepository } from './services.repository';

describe('ServicesService', () => {
  let servicesService: ServicesService;
  let serviceRepository: ServiceRepository;

  beforeEach(async () => {
    const findMock = jest.fn();
    const serviceRepositoryMock = () => ({
      find: findMock,
    });
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ServicesService,
        {
          provide: ServiceRepository,
          useFactory: serviceRepositoryMock,
        },
      ],
    }).compile();

    servicesService = module.get<ServicesService>(ServicesService);
    serviceRepository = module.get<ServiceRepository>(ServiceRepository);
  });

  it('should be defined', () => {
    expect(servicesService).toBeDefined();
  });

  describe('the find function', () => {
    it('should call the find function from repository', () => {
      expect(serviceRepository.find).not.toHaveBeenCalled;
      servicesService.find({});
      expect(serviceRepository.find).toHaveBeenCalled;
    });
  });
});
