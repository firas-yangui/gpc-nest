import { Test, TestingModule } from '@nestjs/testing';
import { SubnatureappsettingsService } from './subnatureappsettings.service';
import { SubNatureAppSettingsRepository } from './subnatureappsettings.repository';
import { async } from 'rxjs/internal/scheduler/async';

const findOneMock = jest.fn();
const findMock = jest.fn();
const subNatureAppSettingsRepositoryMock = () => ({
  find: findMock,
  findOne: findOneMock,
});

describe('SubnatureappsettingsService', () => {
  let subnatureappsettingsService: SubnatureappsettingsService;
  let subNatureAppSettingsRepository: SubNatureAppSettingsRepository;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubnatureappsettingsService,
        {
          provide: SubNatureAppSettingsRepository,
          useFactory: subNatureAppSettingsRepositoryMock,
        },
      ],
    }).compile();

    subnatureappsettingsService = module.get<SubnatureappsettingsService>(SubnatureappsettingsService);
    subNatureAppSettingsRepository = module.get<SubNatureAppSettingsRepository>(SubNatureAppSettingsRepository);
  });

  it('should be defined', () => {
    expect(subnatureappsettingsService).toBeDefined();
    expect(subNatureAppSettingsRepository).toBeDefined();
  });

  describe('the find function', () => {
    it('should call the find function of the repository', () => {
      expect(subNatureAppSettingsRepository.find).not.toHaveBeenCalled;
      subnatureappsettingsService.find({});
      expect(subNatureAppSettingsRepository.find).toHaveBeenCalledWith({});
    });

    it('should return the right value of the repository', async () => {
      findMock.mockResolvedValue({});
      const res = await subnatureappsettingsService.find({});
      expect(subNatureAppSettingsRepository.find).toHaveBeenCalledWith({});
      expect(res).toEqual({});
    });
  });

  describe('the findOne function', () => {
    it('should call the findOne function of the repository', () => {
      expect(subNatureAppSettingsRepository.findOne).not.toHaveBeenCalled;
      subnatureappsettingsService.findOne({});
      expect(subNatureAppSettingsRepository.findOne).toHaveBeenCalledWith({});
    });

    it('should return the right value of the repository', async () => {
      findOneMock.mockResolvedValue({});
      const res = await subnatureappsettingsService.findOne({});
      expect(subNatureAppSettingsRepository.find).toHaveBeenCalledWith({});
      expect(res).toEqual({});
    });
  });
});
