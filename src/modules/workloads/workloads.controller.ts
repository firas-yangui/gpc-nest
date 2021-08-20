import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query } from '@nestjs/common';
import { WorkloadsService } from './workloads.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Workload } from './workload.entity';
import { SynthesisFilterDTO } from './dto/synthesis-filter.dto';
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

  @Post('portfolio-view/portfolios/byGpcAppSettingsId/:gpcAppSettingsId')
  @ApiOperation({ summary: 'get workload for portfolio view of the first level portofolios with filters' })
  async getWorkloadPortfolioViewLevelPortfolioWithFilter(
    @Param('gpcAppSettingsId') gpcAppSettingsId: number,
    @Body() synthesisFilter: SynthesisFilterDTO,
  ): Promise<any> {
    const validProp = (prop: keyof WorkloadTreeDataItem) => prop;
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
}
