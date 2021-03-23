import { Controller, Post, Get, Header, Logger, Param, HttpCode, Body } from '@nestjs/common';
import { ApiResponse, ApiImplicitParam, ApiImplicitBody, ApiOperation, ApiForbiddenResponse } from '@nestjs/swagger';

import { ErrorModel } from '../exceptions-handler/error-model';
import { HomeMessage } from './homeMessage.entity';
import { HomeMessageDto } from './homeMessage.dto';
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
  async getLatest(@Param('perimeterId') perimeterId): Promise<HomeMessage> {
    Logger.log('Get homepage message', 'HomeMessageController');
    return await this.homeMessageService.getLatest(perimeterId);
  }

  @Post()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.write')
  @ApiImplicitBody({ name: 'message', description: 'Admin message', type: 'string' })
  @ApiImplicitBody({ name: 'perimeterId', description: 'User perimeter ID', type: 'number' })
  @ApiOperation({
    description: 'Create Home Message',
    title: 'Create',
    operationId: 'POST /homeMessage',
  })
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create Home Message',
    type: HomeMessage,
    isArray: false,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorModel, isArray: false })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create(@Body() homeMessageDto: HomeMessageDto): Promise<HomeMessage> {
    Logger.log('Create HomeMessage', 'HomeMessageController');
    const newMessage = await this.homeMessageService.create(homeMessageDto);
    return newMessage;
  }
}
