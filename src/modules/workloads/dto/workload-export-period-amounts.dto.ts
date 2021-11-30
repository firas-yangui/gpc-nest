import { ApiProperty } from '@nestjs/swagger';

export class WorkloadExportPeriodAmountsDTO {
  @ApiProperty() id: number;
  @ApiProperty() status: number;
  @ApiProperty() keurossales: number;
  @ApiProperty() keuros: number;
  @ApiProperty() klocalcurrency: number;
  @ApiProperty() mandays: number;
  @ApiProperty() reporting_elapsed_tim: number;
  @ApiProperty() reporting_achievement: number;
  @ApiProperty() is_invested: string;
  @ApiProperty() partner_trigrams: string;
}
