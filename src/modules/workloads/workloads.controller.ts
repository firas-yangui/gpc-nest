import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Query } from '@nestjs/common';
import { WorkloadsService } from './workloads.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Workload } from './workload.entity';
import { SynthesisFilterDto } from './dto/synthesis-filter.dto';
import { WorkloadTreeDataItem } from './interface/workload-tree-data-item.interface';

@Controller('workloads')
@ApiTags('Workloads')
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

  @Get('porfolio-view/portofolios')
  @ApiOperation({ summary: 'get workload for portofolio view of the first level portofolios with filters' })
  async getWorkloadPortofolioViewLevelPorfolioWithFilter(@Body() synthesisFilter: SynthesisFilterDto): Promise<any> {
    const columns = ['serviceName' as keyof WorkloadTreeDataItem];
    const parentTreeNode = null; //no parent for first level
    return await this.workloadsService.getWorkloadPortofolioViewTreeDataWithFilter(columns, parentTreeNode, synthesisFilter);
  }

  @Get('porfolio-view/portofolio/:portofolioId/subservices')
  @ApiOperation({ summary: 'get workload for portofolio view of the second level sub-service with filters' })
  async getWorkloadPortofolioViewLevelSubServiceWithFilter(
    @Param('portofolioId') portofolioId: number,
    @Body() sythesisFilter: SynthesisFilterDto,
  ): Promise<any> {
    //return await this.workloadsService.getWorkloadsWithAmounts(query);
    return;
  }

  @Get('porfolio-view/portofolio/:portofolioId/subservice/:subServiceId')
  @ApiOperation({ summary: 'get workload for portofolio view of the third level workload with filters' })
  async getWorkloadPortofolioViewLevelWorkloadWithFilter(
    @Param('portofolioId') portofolioId: number,
    @Param('subServiceId') subServiceId: number,
    @Body() sythesisFilter: SynthesisFilterDto,
  ): Promise<any> {
    //return await this.workloadsService.getWorkloadsWithAmounts(query);
    return;
  }
}
