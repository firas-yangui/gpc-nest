import { Controller, Get, HttpStatus, HttpException, Query, Logger } from '@nestjs/common';
import { AmountStatsService } from './amountstats.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('amount-stats')
@ApiTags('amount-stats')
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

  @Get()
  async getSingleAmount(@Query() query) {
    try {
      Logger.log(query);
      return await this.amountstatsService.getAmount(query);
    } catch (error) {
      Logger.error(error);
      return { keuros: 0, klocalcurrency: 0, keurossales: 0, mandays: 0 };
    }
  }
}
