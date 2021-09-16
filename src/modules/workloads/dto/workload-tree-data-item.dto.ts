import { ApiProperty } from '@nestjs/swagger';
import { WorkloadTreePeriodAmountsDTO } from './workload-tree-period-amounts.dto';
import { ApiModelProperty } from '@nestjs/swagger/dist/decorators/api-model-property.decorator';

export class WorkloadTreeDataItemDTO {
  /* Portofolio View Section*/

  @ApiProperty() stasPlanName: string; //stas as subtypologyappsettings
  @ApiProperty() stasModelId: number;

  @ApiProperty() ssName: string; // ss as Sub Service
  @ApiProperty() ssCode: string;
  @ApiProperty() ssId: number;

  @ApiProperty() snName: string; // sn as Sub Nature
  @ApiProperty() snId: number;

  @ApiProperty() sName: string; // s as service
  @ApiProperty() sId: number;
  @ApiProperty() sCode: string;
  @ApiProperty() sDescr: string;
  @ApiProperty() sLastUpt: string;

  @ApiProperty() wlCode: string; // wl as workload
  @ApiProperty() wlStatus: string;
  @ApiProperty() wlId: number;
  @ApiProperty() wlDescription: string;

  @ApiProperty() tpId: string; //tp as thirdparty
  @ApiProperty() tpTrigram: string;

  @ApiProperty() adName: string; //ad as activity domaine

  /* Entity View Section*/
  //ToDo

  @ApiProperty() dptId: number; //dpt as thirdparty as the parent department of services, to be verified
  @ApiProperty() dptTrigram: number; //dpt as thirdparty as the parent department of services, to be verified
  /* Partner View */
  //ToDo

  @ApiProperty({ isArray: true, type: WorkloadTreePeriodAmountsDTO })
  periodAmounts: WorkloadTreePeriodAmountsDTO[];
}