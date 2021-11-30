import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ActivityDomainService } from './activity-domain.service';
import { ActivityDomain } from './activity-domain.entity';

@Controller('activity-domain')
@ApiTags('activity-domain')
export class ActivityDomainController {
  constructor(private activityDomainService: ActivityDomainService) {}

  @Get('/:gpcAppSettingsId')
  @ApiOperation({ summary: 'loads activity domain by gpcAppSettingsId' })
  @ApiResponse({
    status: 200,
    description: 'Return all activity domain by gpcAppSettingsId',
    type: ActivityDomain,
    isArray: true,
  })
  findAllByGpcAppSettingsId(@Param('gpcAppSettingsId') gpcAppSettingsId: number) {
    return this.activityDomainService.find(gpcAppSettingsId);
  }
}
