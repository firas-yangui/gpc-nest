import { EmployeeEntity } from './employee.entity';

import * as lowdb from 'lowdb';
import * as Memory from 'lowdb/adapters/Memory';

interface DbSchema {
  employees: EmployeeEntity[];
}

const adapter = new Memory<DbSchema>('employee');
const db = lowdb(adapter);

db.defaults({
  employees: [
    {
      id: 0,
      lastName: 'Pilgrim',
      firstName: 'Scott',
      email: 'scott.pilgrim@socgen.com',
      isActive: true,
      depId: 15,
      salary: 10000,
    },
    {
      id: 1,
      lastName: 'Flowers',
      firstName: 'Ramona Victoria',
      email: 'ramona-victoria.flowers@socgen.com',
      isActive: true,
      depId: 18,
      salary: 15000,
    },
  ],
}).write();

export default db;
