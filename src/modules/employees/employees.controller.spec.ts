import { Test } from '@nestjs/testing';

import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { SgConnectModule } from '@societe-generale/nestjs-sg-connect';

// Mock employees.service
// https://jestjs.io/docs/en/es6-class-mocks
jest.mock('./employees.service');

describe('EmployeesController', () => {
  let controller: EmployeesController;
  let service: EmployeesService;

  beforeEach(async () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (EmployeesService as any).mockClear();
    const module = await Test.createTestingModule({
      imports: [
        SgConnectModule.register({
          sgConnectUrl: '',
          debug: false,
        }),
      ],
      providers: [EmployeesController, EmployeesService],
    }).compile();

    controller = module.get<EmployeesController>(EmployeesController);
    service = module.get<EmployeesService>(EmployeesService);
  });

  describe('getAll', () => {
    it('should call service.getAll', async () => {
      await controller.getAll();
      expect(service.getAll).toHaveBeenCalled();
    });
  });

  describe('getOne', () => {
    it('should call service.getOne', async () => {
      await controller.getOne(0);
      expect(service.getOne).toHaveBeenCalledWith(0);
    });
  });

  describe('create', () => {
    it('should call service.create', async () => {
      const dto = {
        firstName: 'Homer',
        lastName: 'Simpson',
        depId: 0,
        email: 'homer.simpson@simpsons.org',
      };
      await controller.create(dto);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('update', () => {
    it('should call service.update', async () => {
      const id = 0;
      const dto = {
        id,
        firstName: 'Homer',
        lastName: 'Simpson',
        depId: 0,
        email: 'homer.simpson@simpsons.org',
      };
      await controller.update(id, dto);
      expect(service.update).toHaveBeenCalledWith(id, dto);
    });
  });

  describe('remove', () => {
    it('should call service.remove', async () => {
      const id = 0;
      await controller.remove(id);
      expect(service.remove).toHaveBeenCalledWith(id);
    });
  });
});
