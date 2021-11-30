import { Test, TestingModule } from '@nestjs/testing';
import { ActivityDomainService } from './activity-domain.service';
import { ActivityDomainController } from './activity-domain.controller';

const activityDomainServiceMock = () => ({});
describe('Activity Domain Controller', () => {
  let controller: ActivityDomainController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ActivityDomainController],
      providers: [
        {
          provide: ActivityDomainService,
          useFactory: activityDomainServiceMock,
        },
      ],
    }).compile();

    controller = module.get<ActivityDomainController>(ActivityDomainController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
