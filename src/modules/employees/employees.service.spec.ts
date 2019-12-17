import { Test } from '@nestjs/testing';

import { EmployeesService } from './employees.service';
import { EmployeesDataSource } from './employees.datasource';

describe('EmployeesService', () => {
  let empService: EmployeesService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      // EmployeesDataSource is already a Mock
      providers: [EmployeesService, EmployeesDataSource],
    }).compile();

    empService = module.get<EmployeesService>(EmployeesService);
  });

  describe('getAll', () => {
    it('should retrieve all employees', async () => {
      expect(await empService.getAll()).toMatchInlineSnapshot(`
        Array [
          Object {
            "depId": 15,
            "email": "scott.pilgrim@socgen.com",
            "firstName": "Scott",
            "id": 0,
            "isActive": true,
            "lastName": "Pilgrim",
            "salary": 10000,
          },
          Object {
            "depId": 18,
            "email": "ramona-victoria.flowers@socgen.com",
            "firstName": "Ramona Victoria",
            "id": 1,
            "isActive": true,
            "lastName": "Flowers",
            "salary": 15000,
          },
        ]
      `);
    });
  });

  describe('getOne', () => {
    it('should throw NotFoundException if not found', async () => {
      await expect(empService.getOne(999)).rejects.toThrowErrorMatchingInlineSnapshot(`"The employee with the id 999 doesn't exist"`);
    });

    it('should return EmployeeEntity if found', async () => {
      return expect(await empService.getOne(0)).toMatchInlineSnapshot(`
                Object {
                  "depId": 15,
                  "email": "scott.pilgrim@socgen.com",
                  "firstName": "Scott",
                  "id": 0,
                  "isActive": true,
                  "lastName": "Pilgrim",
                  "salary": 10000,
                }
              `);
    });
  });

  describe('create', () => {
    it('should create and return a new employee', async () => {
      expect(
        await empService.create({
          depId: 15,
          email: 'stlili@example.com',
          firstName: 'Sami',
          lastName: 'Tlili',
        }),
      ).toMatchInlineSnapshot(`
        Object {
          "depId": 15,
          "email": "stlili@example.com",
          "firstName": "Sami",
          "id": 2,
          "isActive": false,
          "lastName": "Tlili",
          "salary": 0,
        }
      `);
    });
  });

  describe('update', () => {
    it('should throw if the entity is not found', async () => {
      const id = 999;
      const dto = {
        depId: 15,
        email: 'knives.chau@socgen.com',
        firstName: 'Knives',
        lastName: 'Chau',
      };
      await expect(empService.update(id, dto)).rejects.toThrowErrorMatchingInlineSnapshot(`"The employee with the id 999 doesn't exist"`);
    });

    it('should update and return updated entity', async () => {
      const id = 1;
      const dto = {
        depId: 15,
        email: 'knives.chau@socgen.com',
        firstName: 'Knives',
        lastName: 'Chau',
      };
      expect(await empService.update(id, dto)).toMatchInlineSnapshot(`
        Object {
          "depId": 15,
          "email": "knives.chau@socgen.com",
          "firstName": "Knives",
          "id": 1,
          "isActive": true,
          "lastName": "Chau",
          "salary": 15000,
        }
      `);
    });
  });

  describe('remove', () => {
    it('should throw if the entity is not found', async () => {
      const id = 999;
      await expect(empService.remove(id)).rejects.toThrowErrorMatchingInlineSnapshot(`"The employee with the id 999 doesn't exist"`);
    });

    it('should delete and return deleted entity', async () => {
      const id = 1;
      expect(await empService.remove(id)).toMatchInlineSnapshot(`
        Object {
          "depId": 15,
          "email": "knives.chau@socgen.com",
          "firstName": "Knives",
          "id": 1,
          "isActive": true,
          "lastName": "Chau",
          "salary": 15000,
        }
      `);
    });
  });
});
