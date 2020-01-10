import { Controller, Get, Param, ParseIntPipe, Req } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiImplicitHeader } from '@nestjs/swagger';
import { Request } from 'express';
import { WorkloadsService } from './workloads.service';
import { PeriodType, TotalAmountForThirdpartyRootData } from './../interfaces/common-interfaces';
@Controller('workloads')
export class WorkloadsController {
  constructor(private readonly workloadsService: WorkloadsService) {}

  @Get('/total-amount/:periodType/:thirdpartyRootId')
  async getUserByEmail(
    @Req() request: Request,
    @Param('periodType') periodType: PeriodType,
    @Param('thirdpartyRootId', new ParseIntPipe()) thirdpartyRootId: number,
  ): Promise<TotalAmountForThirdpartyRootData> {
    const user = await this.workloadsService.getTotalAmountForThirdpartyRoot(request, periodType, thirdpartyRootId);
    return user;
  }
}
