import { Controller, Get, Logger, Query } from '@nestjs/common';
import { PeriodsService } from './periods.service';

@Controller('periods')
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
}
