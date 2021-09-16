import { ApiProperty } from '@nestjs/swagger';
import { SynthesisFilterDTO } from './synthesis-filter.dto';
import { WorkloadTreeDataItemDTO } from './workload-tree-data-item.dto';

export class WorkloadTreeDataRequestDTO {
  @ApiProperty() gpcAppSettingsId: number;
  @ApiProperty() columns: Array<keyof WorkloadTreeDataItemDTO>;
  @ApiProperty({ nullable: true }) parentTreeNode: Partial<WorkloadTreeDataItemDTO>;
  @ApiProperty({ nullable: true }) syntheseFilter: SynthesisFilterDTO;
  @ApiProperty({ type: Number, isArray: true }) periodIds: number[];
}
