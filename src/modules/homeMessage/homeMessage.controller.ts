import { Controller, Get, Header, Logger, Param } from '@nestjs/common';
import { ApiResponse, ApiImplicitParam } from '@nestjs/swagger';

import { ErrorModel } from '../exceptions-handler/error-model';
import { HomeMessage } from './homeMessage.entity';
import { HomeMessageService } from './homeMessage.service';

@Controller('homeMessage')
export class HomeMessageController {
  constructor(private readonly homeMessageService: HomeMessageService) {}

  @Get('latest/:perimeterId')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.read')
  @ApiImplicitParam({ name: 'perimeterId', description: 'User perimeter' })
  @ApiResponse({
    status: 200,
    description: 'Returns HomeMessage',
    type: HomeMessage,
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
  async getLatest(@Param('perimeterId') perimeterId): Promise<HomeMessage[]> {
    Logger.log('Get homepage message', 'HomeMessageController');
    return await this.homeMessageService.getLatest(perimeterId);
  }
}
