import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query } from '@nestjs/common';
import { WorkloadsService } from './workloads.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Workload } from './workload.entity';
import { SynthesisFilterDTO } from './dto/synthesis-filter.dto';
import { WorkloadTreeDataItemDTO } from './dto/workload-tree-data-item.dto';
import { WorkloadTreeDataRequestDTO } from './dto/workload-tree-data-request.dto';

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

  @Post('portfolio-view/portfolios/byGpcAppSettingsId/:gpcAppSettingsId')
  @ApiOperation({ summary: 'get workload for portfolio view of the first level portofolios with filters' })
  async getWorkloadPortfolioViewLevelPortfolioWithFilter(
    @Param('gpcAppSettingsId') gpcAppSettingsId: number,
    @Body() synthesisFilter: SynthesisFilterDTO,
  ): Promise<any> {
    const validProp = (prop: keyof WorkloadTreeDataItemDTO) => prop;
    const columns = [validProp('sId'), validProp('sName'), validProp('sCode'), validProp('sDescr'), validProp('sLastUpt')];
    const parentTreeNode = null; //no parent for first level
    return await this.workloadsService.getWorkloadPortfolioViewTreeDataWithFilter(gpcAppSettingsId, columns, parentTreeNode, synthesisFilter, [
      110,
      126,
    ]);
  }

  //to do
  @Post('portfolio-view/portfolio/:portfolioId/subservices')
  @ApiOperation({ summary: 'get workload for portofolio view of the second level sub-service with filters' })
  async getWorkloadPortfolioViewLevelSubServiceWithFilter(
    @Param('portfolioId') portfolioId: number,
    @Body() sythesisFilter: SynthesisFilterDTO,
  ): Promise<any> {
    //return await this.workloadsService.getWorkloadsWithAmounts(query);
    return;
  }

  //to do
  @Post('portfolio-view/portfolio/:portfolioId/subservice/:subServiceId')
  @ApiOperation({ summary: 'get workload for portofolio view of the third level workload with filters' })
  async getWorkloadPortfolioViewLevelWorkloadWithFilter(
    @Param('portfolioId') portfolioId: number,
    @Param('subServiceId') subServiceId: number,
    @Body() sythesisFilter: SynthesisFilterDTO,
  ): Promise<any> {
    //return await this.workloadsService.getWorkloadsWithAmounts(query);
    return;
  }

  @Post('workload-generic-tree-data-with-filter')
  @ApiOperation({ summary: 'gets generic workload tree data' })
  @ApiResponse({ status: 200, type: WorkloadTreeDataItemDTO, isArray: true })
  async getWorkloadPortfolioViewTreeDataWithFilter(@Body() req: WorkloadTreeDataRequestDTO): Promise<WorkloadTreeDataItemDTO[]> {
    try {
      return await this.workloadsService.getWorkloadPortfolioViewTreeDataWithFilter(
        req.gpcAppSettingsId,
        req.columns,
        req.parentTreeNode,
        req.syntheseFilter,
        req.periodIds,
      );
    } catch (e) {
      console.log(e);
    }
  }
}
