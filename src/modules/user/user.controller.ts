import { Controller, Get, Param, Header, UseFilters } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiHeader, ApiTags } from '@nestjs/swagger';
import { UserService } from './user.service';
import { User } from './user.entity';
import { ErrorModel } from './../exceptions-handler/error-model';
import { AllExceptionsFilter } from './../exceptions-handler/all-exceptions.filter';
import { FindAndCountInterface } from './../interfaces/common-interfaces';

@Controller('users')
@ApiTags('Users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/whoami/:email')
  @ApiOperation({
    description: 'Get all employees',
    
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
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
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
  @UseFilters(new AllExceptionsFilter())
  async getAllUsers(): Promise<FindAndCountInterface<User, number>> {
    return await this.userService.findAndCount();
  }
}
