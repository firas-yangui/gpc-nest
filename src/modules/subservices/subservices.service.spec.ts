import { Test, TestingModule } from '@nestjs/testing';
import { SubservicesService } from './subservices.service';
import { SubServiceRepository } from './subservices.repository';

const findMock = jest.fn();
const findOneMock = jest.fn();
const subServiceRepositoryMock = () => ({
  find: findMock,
  findOne: findOneMock,
});

describe('SubservicesService', () => {
  let subservicesService: SubservicesService;
  let subServiceRepository: SubServiceRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubservicesService,
        {
          provide: SubServiceRepository,
          useFactory: subServiceRepositoryMock,
        },
      ],
    }).compile();

    subservicesService = module.get<SubservicesService>(SubservicesService);
    subServiceRepository = module.get<SubServiceRepository>(SubServiceRepository);
  });

  it('should be defined', () => {
    expect(subservicesService).toBeDefined();
    expect(subServiceRepository).toBeDefined();
  });

  describe('the find function', () => {
    it('should call the find function of the repository', () => {
      expect(subServiceRepository.find).not.toHaveBeenCalled;
      subservicesService.find({});
      expect(subServiceRepository.find).toHaveBeenCalledWith({});
    });

    it('should return the right value of the repository', async () => {
      findMock.mockResolvedValue({});
      const res = await subservicesService.find({});
      expect(subServiceRepository.find).toHaveBeenCalledWith({});
      expect(res).toEqual({});
    });
  });

  describe('the findOne function', () => {
    it('should call the findOne function of the repository', () => {
      expect(subServiceRepository.findOne).not.toHaveBeenCalled;
      subservicesService.findOne({});
      expect(subServiceRepository.findOne).toHaveBeenCalledWith({});
    });

    it('should return the right value of the repository', async () => {
      findOneMock.mockResolvedValue({});
      const res = await subservicesService.findOne({});
      expect(subServiceRepository.findOne).toHaveBeenCalledWith({});
      expect(res).toEqual({});
    });
  });
});
