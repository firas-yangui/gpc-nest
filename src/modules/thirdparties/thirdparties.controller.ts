import { Controller, Get, Header, Logger, Query, UseFilters } from '@nestjs/common';
import { ApiResponse, ApiHeader, ApiTags, ApiOperation } from '@nestjs/swagger';

import { Thirdparty } from './thirdparty.entity';
import { ThirdpartiesService } from './thirdparties.service';
import { AllExceptionsFilter } from './../exceptions-handler/all-exceptions.filter';
import { ErrorModel } from './../exceptions-handler/error-model';
import { Thirdparty as ThirdpartyInterface } from './../interfaces/common-interfaces';
import { isNull, isUndefined } from 'lodash';

@Controller('thirdparties')
@ApiTags('thirdparties')
export class ThirdpartiesController {
  constructor(private readonly thirdpartiesService: ThirdpartiesService) {}

  @Get('/enriched-with-appsettings')
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
  async getAllThirdparties(@Query() query): Promise<ThirdpartyInterface[]> {
    return await this.thirdpartiesService.find(query);
  }

  @Get('/hed-entity-view')
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

  @Get('/with-amounts')
  async getAllThirdpartiesByPerimeterWithAmountsSums(@Query() query) {
    try {
      Logger.log('Getting thirdparties with amounts ' + query, 'ThirdpartiesController');

      const { gpcAppSettingsId, thirdpartyRootId, periodId } = query;

      if (isNull(gpcAppSettingsId) || isUndefined(gpcAppSettingsId)) throw new Error('Please set the perimeter id!');
      else if (isNull(thirdpartyRootId) || isUndefined(thirdpartyRootId)) throw new Error("Please set the root thirdparty's id!");
      else if (isNaN(+gpcAppSettingsId)) throw new Error('Perimeter id should be of type number!');

      return await this.thirdpartiesService.findThirdpartiesWithAmountTotals({ gpcAppSettingsId, thirdpartyRootId, periodId });
    } catch (error) {
      Logger.error(error, 'ThirdpartiesController');
    }
  }
  @Get('/get-thirdParty')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiResponse({
    status: 200,
    description: 'getThirdparty',
    isArray: true,
    type: Thirdparty,
  })
  @ApiResponse({
    status: 500,
    description: 'Internal server error',
    type: ErrorModel,
    isArray: false,
  })
  async getThirdParty(): Promise<any[]> {
    return await this.thirdpartiesService.getThirdParty();
  }
}
