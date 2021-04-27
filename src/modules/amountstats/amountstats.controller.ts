import { Controller, Get, HttpStatus, HttpException, Query, Logger } from '@nestjs/common';
import { AmountStatsService } from './amountstats.service';

@Controller('amountstats')
export class AmountstatsController {
  constructor(private readonly amountstatsService: AmountStatsService) {}

  @Get('/total-amount')
  async getTotalByPeriodTypesAndBusinessPlan(@Query() query: { [key: string]: number }) {
    try {
      const { thirdpartyRootId } = query;
      if (!thirdpartyRootId) throw new HttpException('Please set the thirdpartyrootId value', HttpStatus.BAD_REQUEST);
      Logger.log('Getting total amounts\n' + JSON.stringify(query), 'AmountStatsController');
      return await this.amountstatsService.getFilteredTotalAmounts(query, thirdpartyRootId);
    } catch (error) {
      Logger.error(error);
      return [];
    }
  }
}
