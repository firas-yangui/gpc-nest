import { ApiProperty } from '@nestjs/swagger';

export class SynthesisFilterDTO {
  @ApiProperty({ nullable: true })
  code?: string;

  @ApiProperty({ nullable: true })
  description?: string;

  @ApiProperty({ nullable: true })
  domaine?: string;

  @ApiProperty({ nullable: true })
  thirdparties?: number[];

  @ApiProperty({ nullable: true })
  portfolios?: number[];

  @ApiProperty({ nullable: true })
  plans?: number[];

  @ApiProperty({ nullable: true })
  subnatures?: number[];

  @ApiProperty({ nullable: true })
  partners?: number[];
}
