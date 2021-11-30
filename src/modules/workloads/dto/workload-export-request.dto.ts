import { ApiProperty } from '@nestjs/swagger';
import { SynthesisFilterDTO } from './synthesis-filter.dto';

export class WorkloadExportRequestDTO {
  @ApiProperty() gpcAppSettingsId: number;
  @ApiProperty({ nullable: true }) syntheseFilter: SynthesisFilterDTO;
  @ApiProperty({ type: Number, isArray: true }) periodIds: number[];
}
