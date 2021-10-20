import { ApiProperty } from '@nestjs/swagger';

export class WorkloadTreePeriodAmountsDTO {
  @ApiProperty() keurossales: number;
  @ApiProperty() keuros: number;
  @ApiProperty() klocalcurrency: number;
  @ApiProperty() mandays: number;
  @ApiProperty({ isArray: true, nullable: true, type: String }) partnerTrigrams: string[];
}
