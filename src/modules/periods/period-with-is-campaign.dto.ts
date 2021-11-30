import { ApiProperty } from '@nestjs/swagger';
import { Period } from './period.entity';

export class PeriodWithIsCampaignDto extends Period {
  @ApiProperty({ type: Boolean })
  iscampaignperiod: boolean;
}
