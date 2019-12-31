import { Controller, Get, Param, Header } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiImplicitHeader } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { Request } from 'express';
import { ErrorModel } from './../exceptions-handler/error-model';
import { FindAndCountInterface } from './../interfaces/common-interfaces';

interface SgUser {
  email: string;
}

interface GPCRequest {
  Request: Request;
  sgUser: SgUser;
}

// interface FindAndCountInterface<E> {
//   Entities: E[];
//   count: number;
// }

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/whoami/:email')
  @ApiOperation({
    description: 'Get all employees',
    title: 'Get all',
    operationId: 'GET /employees',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all employees',
    type: User,
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
  async getUserByEmail(@Param('email') email: string): Promise<User> {
    const user = await this.userService.getUserByEmail(email);
    return user;
  }

  @Get()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.read')
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiResponse({
    status: 200,
    description: 'Return all employees',
    type: User,
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
  async getAllUsers(): Promise<FindAndCountInterface<User, number>> {
    return await this.userService.findAndCount();
  }
}
