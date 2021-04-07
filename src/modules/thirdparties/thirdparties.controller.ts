import { Controller, Get, Header, UseFilters } from '@nestjs/common';
import { ApiResponse, ApiImplicitHeader } from '@nestjs/swagger';

import { Thirdparty } from './thirdparty.entity';
import { ThirdpartiesService } from './thirdparties.service';
import { AllExceptionsFilter } from './../exceptions-handler/all-exceptions.filter';
import { ErrorModel } from './../exceptions-handler/error-model';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';

@Controller('thirdparties')
export class ThirdpartiesController {
  constructor(private readonly thirdpartiesService: ThirdpartiesService) {}

  @Get('/enriched-with-appsettings')
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
    description: 'Return all thirdparties',
    type: Thirdparty,
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
  async getAllUsers(): Promise<ThirdpartyInterface[]> {
    const options = {
      relations: ['thirdpartyappsettings', 'thirdpartyappsettings.gpcappsettings', 'country'],
    };

    return await this.thirdpartiesService.find(options);
  }

  @Get('/enriched-entity-view')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.read')
  @ApiResponse({
    status: 200,
    description: 'Return all thirdparties',
    type: Thirdparty,
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
  async getThirdpartiesHydrated(): Promise<any[]> {
    return await this.thirdpartiesService.getHydratedThirdpartiesSkipTake();
  }
}
