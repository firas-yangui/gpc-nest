import { Test, TestingModule } from '@nestjs/testing';
import { ServicesController } from './services.controller';
import { ServicesService } from './services.service';

const servicesServiceMock = () => ({});
describe('Services Controller', () => {
  let controller: ServicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ServicesController],
      providers: [
        {
          provide: ServicesService,
          useFactory: servicesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ServicesController>(ServicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
