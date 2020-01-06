import { Controller, Get, Header } from '@nestjs/common';
import { ApiUseTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiForbiddenResponse, ApiImplicitHeader } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './transaction.entity';
import { ErrorModel } from '../exceptions-handler/error-model';
@Controller('transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Get all transactions
  @Get()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-APP-CODE', description: 'Consumer App Code' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-APP-NAME', description: 'Consumer App Name' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-CODE', description: 'Consumer Code' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-NAME', description: 'Consumer Name' })
  @ApiImplicitHeader({ name: 'X-BSC-SOA-CONSUMER-ORG', description: 'Consumer Organization' })
  @ApiOperation({
    description: 'Get all transactions',
    title: 'Get all',
    operationId: 'GET /transaction',
  })
  @ApiResponse({
    status: 200,
    description: 'Return all transactions',
    type: TransactionEntity,
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
  private async getAll() {
    return await this.transactionService.getAll();
  }
}
