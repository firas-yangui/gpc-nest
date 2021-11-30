import { ApiProperty } from '@nestjs/swagger';

export class SynthesisFilterDTO {
  @ApiProperty({ nullable: true })
  code?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true, isArray: true, type: Number })
  domains?: number[];

  @ApiProperty({ nullable: true, isArray: true, type: Number })
  thirdparties?: number[];

  @ApiProperty({ nullable: true, isArray: true, type: Number })
  portfolios?: number[];

  @ApiProperty({ nullable: true, isArray: true, type: String })
  plans?: string[];

  @ApiProperty({ nullable: true, isArray: true, type: Number })
  subnatures?: number[];

  @ApiProperty({ nullable: true, isArray: true, type: Number })
  partners?: number[];

  @ApiProperty({ nullable: true, isArray: true, type: String })
  workloadThirdPartyType?: string[];
}
