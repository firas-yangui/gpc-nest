import { Controller, Header, Get, Post, Param } from '@nestjs/common';
import { ActivityThirdPartyService } from './activity-thirdparty.service';

@Controller('activity-thirdparty')
export class ActivityThirdPartyController {
  constructor(private readonly activityThirdPartyService: ActivityThirdPartyService) {}
}
