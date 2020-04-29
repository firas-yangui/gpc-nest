import { Test, TestingModule } from '@nestjs/testing';
import { ThirdpartiesController } from './thirdparties.controller';
import { ThirdpartiesService } from './thirdparties.service';

const thirdpartiesServiceMock = () => ({});
describe('Thirdparties Controller', () => {
  let controller: ThirdpartiesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ThirdpartiesController],
      providers: [
        {
          provide: ThirdpartiesService,
          useFactory: thirdpartiesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ThirdpartiesController>(ThirdpartiesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
