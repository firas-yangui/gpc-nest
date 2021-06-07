import { Controller, Get, HttpException, HttpStatus, Param, Query } from '@nestjs/common';
import { Workload } from '../workloads/workload.entity';
import { SubService } from './subservice.entity';
import { SubservicesService } from './subservices.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('subservices')
@ApiTags('subservices')
export class SubservicesController {
  constructor(private subservicesService: SubservicesService) {}

  @Get()
  async findAll(@Query() query): Promise<SubService[]> {
    return await this.subservicesService.find(query);
  }

  @Get('with-amount')
  async getSubservicesWithAmounts(@Query() query): Promise<any> {
    return await this.subservicesService.getSubservicesWithAmounts(query);
  }

  @Get(':id')
  findById(@Param('id') id: number): Promise<SubService> {
    return this.subservicesService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }

  @Get(':id/getWorkloads')
  getWorkloads(@Param('id') id: number): Promise<Workload[]> {
    return this.subservicesService.getWorkloads({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
