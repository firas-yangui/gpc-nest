import {Body, Controller, Get, HttpException, HttpStatus, Logger, Param, Query} from '@nestjs/common';
import { WorkloadsService } from './workloads.service';
import { ApiTags } from '@nestjs/swagger';
import { Workload } from './workload.entity';
import {SynthesisFilter} from "./interface/synthesis-filter.interface";

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
  async getWorkloadPortofolioViewLevelPorfolioWithFilter(@Body()synthesisFilter: SynthesisFilter): Promise<any> {
    //const columns =
   // return await this.workloadsService.getWorkloadPortofolioViewTreeDataWithFilter(columns, synthesisFilter);
    return ;
  }

  @Get('porfolio-view/portofolio/:portofolioId/subservices')
  async getWorkloadPortofolioViewLevelSubServiceWithFilter(@Param ('portofolioId')portofolioId:number , @Body()sythesisFilter: SynthesisFilter): Promise<any> {
    //return await this.workloadsService.getWorkloadsWithAmounts(query);
    return ;
  }

  @Get('porfolio-view/portofolio/:portofolioId/subservice/:subServiceId')
  async getWorkloadPortofolioViewLevelWorkloadWithFilter(@Param ('portofolioId')portofolioId:number , @Param ('subServiceId')subServiceId:number, @Body()sythesisFilter: SynthesisFilter): Promise<any> {
    //return await this.workloadsService.getWorkloadsWithAmounts(query);
    return ;
  }
}
