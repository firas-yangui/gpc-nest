import { Controller, Post, Get, Header, Logger, Param, HttpCode, Body } from '@nestjs/common';
import { ApiResponse, ApiParam, ApiOperation, ApiForbiddenResponse, ApiQuery, ApiTags } from '@nestjs/swagger';

import { ErrorModel } from '../exceptions-handler/error-model';
import { HomeMessageEntity } from './homeMessage.entity';
import { HomeMessageDto } from './homeMessage.dto';
import { HomeMessageService } from './homeMessage.service';

@Controller('homeMessage')
@ApiTags('homeMessage')
export class HomeMessageController {
  constructor(private readonly homeMessageService: HomeMessageService) {}

  @Get('latest/:perimeterId')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.read')
  @ApiParam({ name: 'perimeterId', description: 'User perimeter' })
  @ApiResponse({
    status: 200,
    description: 'Returns HomeMessage',
    type: HomeMessageEntity,
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
  async getLatest(@Param('perimeterId') perimeterId): Promise<HomeMessageEntity> {
    Logger.log('Get homepage message', 'HomeMessageController');
    return await this.homeMessageService.getLatest(perimeterId);
  }

  @Post()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  // @SgConnectScopes('api.soapoc.write')
  @ApiQuery({ name: 'message', description: 'Admin message', type: 'string' })
  @ApiQuery({ name: 'perimeterId', description: 'User perimeter ID', type: 'number' })
  @ApiOperation({
    description: 'Create Home Message',
  })
  @HttpCode(201)
  @ApiResponse({
    status: 201,
    description: 'Create Home Message',
    type: HomeMessageEntity,
    isArray: false,
  })
  @ApiResponse({ status: 400, description: 'Bad request', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 401, description: 'Unauthorized', type: ErrorModel, isArray: false })
  @ApiResponse({ status: 500, description: 'Internal server error', type: ErrorModel, isArray: false })
  @ApiForbiddenResponse({ description: 'Forbidden' })
  async create(@Body() homeMessageDto: HomeMessageDto): Promise<HomeMessageEntity> {
    Logger.log('Create HomeMessage', 'HomeMessageController');
    const newMessage = await this.homeMessageService.create(homeMessageDto);
    return newMessage;
  }
}
