import { Test, TestingModule } from '@nestjs/testing';
import { PeriodsController } from './periods.controller';
import { PeriodsService } from './periods.service';

const periodsServiceMock = () => ({});
describe('Periods Controller', () => {
  let controller: PeriodsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PeriodsController],
      providers: [
        {
          provide: PeriodsService,
          useFactory: periodsServiceMock,
        },
      ],
    }).compile();

    controller = module.get<PeriodsController>(PeriodsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
