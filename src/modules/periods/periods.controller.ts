import { Controller, Get, Logger, Param, Query } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PeriodWithIsCampaignDto } from './period-with-is-campaign.dto';

@Controller('periods')
@ApiTags('periods')
export class PeriodsController {
  constructor(private periodsService: PeriodsService) {}
  @Get()
  async getPeriods(@Query() query) {
    try {
      const { gpcAppSettingsId } = query;
      if (!gpcAppSettingsId) throw new Error('AppSettingsId not set');

      return await this.periodsService.find(gpcAppSettingsId, {});
    } catch (error) {
      Logger.error(error, 'PeriodsController');
      return [];
    }
  }

  @Get('/byGpcAppSettingsId/:gpcAppSettingsId')
  @ApiOperation({ summary: 'loads periods by gpcAppSettingsId' })
  @ApiResponse({
    status: 200,
    description: 'Return all services for by gpcAppSettingsId',
    type: PeriodWithIsCampaignDto,
    isArray: true,
  })
  async findByGpcAppSettingsId(@Param('gpcAppSettingsId') gpcAppSettingsId: number) {
    return await this.periodsService.find(gpcAppSettingsId, {});
  }
}
