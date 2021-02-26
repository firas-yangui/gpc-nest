import { Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Req } from '@nestjs/common';
import { Request } from 'express';
import { WorkloadsService } from './workloads.service';
import { PeriodType } from './../interfaces/common-interfaces';
import { ApiUseTags } from '@nestjs/swagger';
import { Workload } from './workload.entity';

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

  @Get(':id')
  findById(@Param('id') id: number): Promise<Workload> {
    return this.workloadsService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }

  @Get(':id/getPartners')
  getSubServices(@Param('id') id: number): Promise<SubService[]> {
    return this.workloadsService.getWorkloads({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
