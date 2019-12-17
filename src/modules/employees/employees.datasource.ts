import { Injectable } from '@nestjs/common';

import { EmployeeEntity } from './employee.entity';
import db from './employees.db';
import { EmployeeDto } from './employee.dto';

@Injectable()
export class EmployeesDataSource {
  findOne(id: number): EmployeeEntity | undefined {
    const employee = db
      .get('employees')
      .find({ id })
      .value();
    return employee;
  }

  find(): EmployeeEntity[] {
    return db.get('employees').value();
  }

  create(employeeDto: EmployeeDto): EmployeeEntity {
    // DON'T do that in production !!!
    const id =
      db
        .get('employees')
        .last()
        .value().id + 1;
    const newEmployee = { ...employeeDto, id, isActive: false, salary: 0 };
    db.get('employees')
      .push(newEmployee)
      .write();
    return db
      .get('employees')
      .find({ id })
      .value();
  }

  update(id: number, employeeDto: EmployeeDto): EmployeeEntity | undefined {
    const employee = db
      .get('employees')
      .find({ id })
      .value();
    if (!employee) return;
    db.get('employees')
      .find({ id })
      .assign(employeeDto)
      .value();
    return db
      .get('employees')
      .find({ id })
      .value();
  }

  remove(id: number): EmployeeEntity | undefined {
    const employee = db
      .get('employees')
      .find({ id })
      .value();
    if (!employee) return;
    db.get('employees')
      .remove({ id })
      .write();
    return employee;
  }
}
