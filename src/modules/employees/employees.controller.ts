import { Controller, Get, Logger, UseGuards, Post, HttpCode, Body, Put, Header, Param, Delete, ParseIntPipe, UsePipes } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiForbiddenResponse, ApiHeader } from '@nestjs/swagger';
import { SgConnectGuard, SgConnectScopes } from '@societe-generale/nestjs-sg-connect';
import { EmployeesService } from './employees.service';
import { EmployeeEntity } from './employee.entity';
import { EmployeeDto } from './employee.dto';
import { BusinessValidationPipe } from '../exceptions-handler/validation.pipe';
import { ErrorModel } from '../exceptions-handler/error-model';

// SG | Connect secured controller
@Controller('employees')
// @UseGuards(SgConnectGuard)
// @SgConnectScopes('api.soapoc.v1')
@ApiBearerAuth()
@ApiTags('Employees')
export class EmployeesController {
  constructor(private readonly employeesService: EmployeesService) {}

  // Get one
  @Get(':id')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.read')
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiOperation({
    description: 'Get one employee',
    
  })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 403, description: 'Forbidden', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorModel, isArray: false })
  async getOne(@Param('id', new ParseIntPipe()) id: number): Promise<EmployeeEntity> {
    return this.employeesService.getOne(id);
  }

  // Get all employees
  @Get()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.read')
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiOperation({
    description: 'Get all employees',
    
  })
  @ApiResponse({
    status: 200,
    description: 'Return all employees',
    type: EmployeeEntity,
    isArray: true,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorModel,
    isArray: false,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorModel,
    isArray: false,
  })
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async getAll(): Promise<EmployeeEntity[]> {
    Logger.log('Get all employees', 'EmployeesController');
    return this.employeesService.getAll();
  }
  // Create employee
  @Post()
  @UsePipes(new BusinessValidationPipe())
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.write')
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiOperation({
    description: 'Create employee',
    
  })
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create employee',
    type: EmployeeEntity,
    isArray: false,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorModel, isArray: false })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create(@Body() employeeDto: EmployeeDto): Promise<EmployeeEntity> {
    Logger.log('Create employee', 'EmployeesController');
    const employee = await this.employeesService.create(employeeDto);
    return employee;
  }
  // Update
  @Put(':id')
  @UsePipes(new BusinessValidationPipe())
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.write')
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiOperation({
    description: 'Update employee',
    
  })
  @ApiResponse({ status: 200, description: 'Update employee' })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 500, description: 'Internal server error' })
  async update(@Param('id', new ParseIntPipe()) id: number, @Body() employeeDto: EmployeeDto): Promise<EmployeeEntity> {
    Logger.log('Update an employee', 'EmployeesController');
    const employee = await this.employeesService.update(id, employeeDto);
    return employee;
  }
  // Delete employee
  @Delete(':id')
  @Header('Cache-Control', 'none')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.write')
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiOperation({
    description: 'Delete employee',
    
  })
  @ApiResponse({ status: 204, description: 'Delete employee', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 404, description: 'Not found', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorModel, isArray: false })
  async remove(@Param('id', new ParseIntPipe()) id: number): Promise<EmployeeEntity> {
    Logger.log('Remove employee', 'EmployeesController');
    const employee = await this.employeesService.remove(id);
    return employee;
  }
}
