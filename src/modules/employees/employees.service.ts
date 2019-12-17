import { Injectable } from '@nestjs/common';
import { EmployeeDto } from './employee.dto';
import { EntityNotFoundException } from '../exceptions-handler/entity-not-found.exception';
import { EmployeeEntity } from './employee.entity';

import { EmployeesDataSource } from './employees.datasource';

@Injectable()
export class EmployeesService {
  constructor(private dataSource: EmployeesDataSource) {}

  async getOne(id: number): Promise<EmployeeEntity> {
    const employee = this.dataSource.findOne(id);
    if (!employee) {
      throw new EntityNotFoundException('ENTITY_NOT_FOUND', `The employee with the id ${id} doesn't exist`);
    }
    return employee;
  }

  async getAll(): Promise<EmployeeEntity[]> {
    const employees = this.dataSource.find();
    return employees;
  }

  async create(employeeDto: EmployeeDto): Promise<EmployeeEntity> {
    const employee = this.dataSource.create(employeeDto);
    return employee;
  }

  async update(id: number, employeeDto: EmployeeDto) {
    const updatedEmployee = this.dataSource.update(id, employeeDto);
    if (!updatedEmployee) {
      throw new EntityNotFoundException('ENTITY_NOT_FOUND', `The employee with the id ${id} doesn't exist`);
    }
    return updatedEmployee;
  }

  async remove(id: number) {
    const deletedEmployee = this.dataSource.remove(id);
    if (!deletedEmployee) {
      throw new EntityNotFoundException('ENTITY_NOT_FOUND', `The employee with the id ${id} doesn't exist`);
    }
    return deletedEmployee;
  }
}
