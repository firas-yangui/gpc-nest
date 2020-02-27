import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { Request } from 'express';
import { WorkloadsService } from './workloads.service';
import { PeriodType } from './../interfaces/common-interfaces';
import { ApiUseTags } from '@nestjs/swagger';

@Controller('workloads')
@ApiUseTags('Workloads')
export class WorkloadsController {
  constructor(private readonly workloadsService: WorkloadsService) {}

  @Get('/total-amount/:thirdpartyRootId')
  async getTotalByPeriodTypesAndBusinessPlan(
    @Req() request: Request,
    @Param('periodType') periodType: PeriodType,
    @Param('thirdpartyRootId', new ParseIntPipe()) thirdpartyRootId: number,
  ) {
    return await this.workloadsService.getTotalByPeriodTypesAndBusinessPlan(request, thirdpartyRootId);
  }
}
