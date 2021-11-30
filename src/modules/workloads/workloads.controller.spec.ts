import { Test, TestingModule } from '@nestjs/testing';
import { WorkloadsController } from './workloads.controller';
import { WorkloadsService } from './workloads.service';
import { WorkloadExportService } from './workload.export.service';

const workloadsServiceMock = () => ({});
const workloadExportServiceMock = () => ({});
describe('Workloads Controller', () => {
  let controller: WorkloadsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [WorkloadsController],
      providers: [
        {
          provide: WorkloadsService,
          useFactory: workloadsServiceMock,
        },
        {
          provide: WorkloadExportService,
          useFactory: workloadExportServiceMock,
        },
      ],
    }).compile();

    controller = module.get<WorkloadsController>(WorkloadsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
