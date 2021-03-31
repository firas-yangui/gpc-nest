import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post } from '@nestjs/common';
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

  @Post('/total-amount')
  async getTotalByPeriodTypesAndBusinessPlan(@Body() body: { [key: string]: number }) {
    try {
      const { thirdpartyRootId } = body;
      if (!thirdpartyRootId) throw new HttpException('Please set the thirdpartyrootId value', HttpStatus.BAD_REQUEST);

      return await this.workloadsService.getTotalByPeriodTypesAndBusinessPlan(body, thirdpartyRootId);
    } catch (error) {
      Logger.error(error);

      return [];
    }
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Workload> {
    return this.workloadsService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
