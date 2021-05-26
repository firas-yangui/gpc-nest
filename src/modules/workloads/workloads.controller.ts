import { Controller, Get, HttpException, HttpStatus, Logger, Param, Query } from '@nestjs/common';
import { WorkloadsService } from './workloads.service';
import { ApiUseTags } from '@nestjs/swagger';
import { Workload } from './workload.entity';

@Controller('workloads')
@ApiUseTags('Workloads')
export class WorkloadsController {
  constructor(private readonly workloadsService: WorkloadsService) {}

  @Get()
  findAll(): Promise<Workload[]> {
    return this.workloadsService.find({});
  }

  @Get('/total-amount')
  async getTotalByPeriodTypesAndBusinessPlan(@Query() query: { [key: string]: number }) {
    try {
      const { thirdpartyRootId } = query;
      if (!thirdpartyRootId) throw new HttpException('Please set the thirdpartyrootId value', HttpStatus.BAD_REQUEST);

      return await this.workloadsService.getTotalByPeriodTypesAndBusinessPlan(query, thirdpartyRootId);
    } catch (error) {
      Logger.error(error);

      return error;
    }
  }

  @Get('with-amount')
  async getSubservicesWithAmounts(@Query() query): Promise<any> {
    return await this.workloadsService.getWorkloadsWithAmounts(query);
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Workload> {
    return this.workloadsService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
