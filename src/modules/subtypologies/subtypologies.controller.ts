import { Controller, Get, Query } from '@nestjs/common';
import { Subtypology } from './subtypology.entity';
import { SubtypologiesService } from './subtypologies.service';

@Controller('subtypologies')
export class SubtypologiesController {
  constructor(private subtypologiesService: SubtypologiesService) {}
  @Get()
  findAllWithPlans(@Query() query): Promise<Subtypology[]> {
    return this.subtypologiesService.findEnrichedWithPlans(query);
  }
}
