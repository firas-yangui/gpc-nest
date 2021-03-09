import { Controller, Get } from '@nestjs/common';
import { SubNature } from './subnature.entity';
import { SubnatureService } from './subnature.service';

@Controller('subnatures')
export class SubnatureController {
  constructor(private subnaturesService: SubnatureService) {}
  @Get()
  findAll(): Promise<SubNature[]> {
    return this.subnaturesService.find({});
  }
}
