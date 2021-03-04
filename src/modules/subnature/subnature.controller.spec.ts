import { Test, TestingModule } from '@nestjs/testing';
import { SubnatureController } from './subnature.controller';
import { SubnatureService } from './subnature.service';

const subnaturesServiceMock = () => ({});
describe('Subnature Controller', () => {
  let controller: SubnatureController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SubnatureController],
      providers: [
        {
          provide: SubnatureService,
          useFactory: subnaturesServiceMock,
        },
      ],
    }).compile();

    controller = module.get<SubnatureController>(SubnatureController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
