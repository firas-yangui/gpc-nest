import { Controller, Get, Header, Logger, Param } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { TransactionService } from './transaction.service';
import { TransactionEntity } from './transaction.entity';
import { ErrorModel } from '../exceptions-handler/error-model';

@Controller('transactions')
@ApiTags('Transactions')
export class TransactionController {
  constructor(private transactionService: TransactionService) {}

  // Get all transactions
  @Get()
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'Get all transactions',
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

  @Get('/userId/:id/thirdparty/:thirdpartyId')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'Get all transactions',
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
  private async getAllWithUserId(@Param('id') userId: number, @Param('thirdpartyId') thirdpartyId: number) {
    try {
      Logger.log('Fetching user transactions', 'TransactionController');
      return await this.transactionService.getAllWithUserId(userId, thirdpartyId);
    } catch (error) {
      Logger.error(error, 'TransactionController');
    }
  }

  // Get all transactions
  @Get('/latest/:count')
  @Header('Cache-Control', 'none')
  @Header('Content-Type', 'application/json')
  @Header('Accept-Charset', 'utf-8')
  @ApiOperation({
    description: 'Get latest transactions which by default returns the 6 latest transactions but you could pass how many you would want to load',
    summary: 'Get latest transactions',
  })
  @ApiResponse({
    status: 200,
    description: 'Return latest transactions',
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
  private async getLatestTransactions(@Param('count') count: number) {
    try {
      Logger.log(`Get latest ${count} transactions`, 'TransactionController');
      return await this.transactionService.getLatestTransactions(count);
    } catch (err) {
      Logger.error(err, 'TransactionController');
      return [];
    }
  }
}
