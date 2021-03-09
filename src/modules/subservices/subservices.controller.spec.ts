import { Test, TestingModule } from '@nestjs/testing';
import { SubservicesController } from './subservices.controller';
import { SubServiceRepository } from './subservices.repository';
import { SubservicesService } from './subservices.service';

const subservicesServiceMock = () => ({});
describe('Subservices Controller', () => {
  let controller: SubservicesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubservicesController],
      providers: [
        {
          provide: SubservicesService,
          useFactory: subservicesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SubservicesController>(SubservicesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
