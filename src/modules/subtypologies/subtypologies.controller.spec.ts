import { Test, TestingModule } from '@nestjs/testing';
import { SubtypologiesController } from './subtypologies.controller';
import { SubtypologiesService } from './subtypologies.service';

const subtypologiesServiceMock = () => ({});

describe('subtypologies Controller', () => {
  let controller: SubtypologiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubtypologiesController],
      providers: [
        {
          provide: SubtypologiesService,
          useFactory: subtypologiesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SubtypologiesController>(SubtypologiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
