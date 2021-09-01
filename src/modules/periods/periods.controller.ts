import { Body, Controller, Get, Logger, Param, Post, Query } from '@nestjs/common';
import { PeriodsService } from './periods.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { WorkloadTreeDataItemDTO } from '../workloads/dto/workload-tree-data-item.dto';
import { WorkloadTreeDataRequestDTO } from '../workloads/dto/workload-tree-data-request.dto';
import { Period } from './period.entity';

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
    type: Period,
    isArray: true,
  })
  async findByGpcAppSettingsId(@Param('gpcAppSettingsId') gpcAppSettingsId: number) {
    return await this.periodsService.find(gpcAppSettingsId, {});
  }
}
