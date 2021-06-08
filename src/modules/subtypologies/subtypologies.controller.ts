import { Controller, Get, Query } from '@nestjs/common';
import { Subtypology } from './subtypology.entity';
import { SubtypologiesService } from './subtypologies.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('subtypologies')
@ApiTags('subtypologies')
export class SubtypologiesController {
  constructor(private subtypologiesService: SubtypologiesService) {}
  @Get('/enriched-with-plan')
  findAllWithPlans(@Query() query): Promise<Subtypology[]> {
    return this.subtypologiesService.findEnrichedWithPlans(query);
  }
}
