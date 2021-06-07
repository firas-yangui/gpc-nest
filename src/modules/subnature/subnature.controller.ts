import { Controller, Get, Query } from '@nestjs/common';
import { SubNature } from './subnature.entity';
import { SubnatureService } from './subnature.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('subnatures')
@ApiTags('subnatures')
export class SubnatureController {
  constructor(private subnaturesService: SubnatureService) {}
  @Get()
  findAll(@Query() query): Promise<SubNature[]> {
    return this.subnaturesService.find(query);
  }
}
