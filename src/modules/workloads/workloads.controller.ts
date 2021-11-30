import { Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Post, Query } from '@nestjs/common';
import { WorkloadsService } from './workloads.service';
import { ApiOperation, ApiResponse, ApiTags, ApiOAuth2 } from '@nestjs/swagger';
import { Workload } from './workload.entity';
import { SynthesisFilterDTO } from './dto/synthesis-filter.dto';
import { WorkloadTreeDataItemDTO } from './dto/workload-tree-data-item.dto';
import { WorkloadTreeDataRequestDTO } from './dto/workload-tree-data-request.dto';
import { WorkloadExportDataItemDTO } from './dto/workload-export-data-item.dto';
import { WorkloadExportRequestDTO } from './dto/workload-export-request.dto';
import { WorkloadExportService } from './workload.export.service';
import { WorkloadExportByDepartmentDataItemDTO } from './dto/workload-export-by-department-data-item.dto';
import { WorkloadExportByPeriodWithPartnerDataItemDTO } from './dto/workload-export-with-partner-data-item.dto';

@Controller('workloads')
@ApiTags('Workloads')
@ApiOAuth2(['api.gpc-workload-management.v1'], 'SG Connect')
export class WorkloadsController {
  constructor(private readonly workloadsService: WorkloadsService, private readonly workloadExportService: WorkloadExportService) {}

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

  @Post('workload-generic-tree-data-with-filter')
  @ApiOperation({ summary: 'gets generic workload tree data' })
  @ApiResponse({ status: 200, type: WorkloadTreeDataItemDTO, isArray: true })
  async getWorkloadTreeDataWithFilter(@Body() req: WorkloadTreeDataRequestDTO): Promise<WorkloadTreeDataItemDTO[]> {
    try {
      return await this.workloadsService.getWorkloadTreeDataWithFilter(
        req.gpcAppSettingsId,
        req.columns,
        req.parentTreeNode,
        req.syntheseFilter,
        req.periodIds,
      );
    } catch (e) {
      console.error(e);
    }
  }
  @Post('export-csv-workload')
  @ApiOperation({ summary: 'export workload data to csv ' })
  @ApiResponse({ status: 200, type: WorkloadExportDataItemDTO, isArray: true })
  async exportWorkloadWithFilter(@Body() req: WorkloadExportRequestDTO): Promise<WorkloadExportDataItemDTO[]> {
    try {
      return await this.workloadExportService.exportCsvWorkload(req.gpcAppSettingsId, req.syntheseFilter, req.periodIds);
    } catch (e) {
      console.error(e);
    }
  }

  @Post('export-csv-workload-with-partners')
  @ApiOperation({ summary: 'export workload data to csv by period with partners' })
  @ApiResponse({ status: 200, type: WorkloadExportByPeriodWithPartnerDataItemDTO, isArray: true })
  async exportWorkloadByPeriodWithPartners(@Body() req: WorkloadExportRequestDTO): Promise<WorkloadExportByPeriodWithPartnerDataItemDTO[]> {
    try {
      return await this.workloadExportService.exportCsvByPeriodWithPartners(req.gpcAppSettingsId, req.syntheseFilter, req.periodIds);
    } catch (e) {
      console.error(e);
    }
  }

  //temporarily unnecessary
  /* @Post('export-csv-workload-by-department')
  @ApiOperation({ summary: 'export workload/synthesis data by department to csv ' })
  @ApiResponse({ status: 200, type: WorkloadExportByDepartmentDataItemDTO, isArray: true })
  async exportWorkloadByDepartmentWithFilter(@Body() req: WorkloadExportRequestDTO): Promise<WorkloadExportByDepartmentDataItemDTO[]> {
    try {
      return await this.workloadExportService.exportCsvByDepartment(req.gpcAppSettingsId, req.syntheseFilter, req.periodIds);
    } catch (e) {
      console.error(e);
    }
  }*/
}
