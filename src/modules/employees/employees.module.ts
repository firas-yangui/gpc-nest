import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { EmployeesController } from './employees.controller';
import { EmployeesService } from './employees.service';
import { EmployeesDataSource } from './employees.datasource';
import { AllExceptionsFilter } from '../exceptions-handler/all-exceptions.filter';

@Module({
  imports: [],
  controllers: [EmployeesController],
  providers: [
    EmployeesService,
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
    EmployeesDataSource,
  ],
  exports: [],
})
export class EmployeesModule {}
