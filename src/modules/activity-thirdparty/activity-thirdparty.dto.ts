import { PartnerPercentage } from './partner-percentage.dto';
export class ActivityThirdPartyDto {
  private startDate: Date;
  private endDate: Date;
  private activity: number;
  private partnerPercentages: PartnerPercentage[];

  constructor(activityThirdPartyDto: ActivityThirdPartyDto) {
    this.startDate = activityThirdPartyDto.startDate;
    this.endDate = activityThirdPartyDto.endDate;
    this.activity = activityThirdPartyDto.activity;
    this.partnerPercentages = activityThirdPartyDto.partnerPercentages;
  }

  public getStartDate(): Date {
    return this.startDate;
  }

  public getEndDate(): Date {
    return this.endDate;
  }

  public getActivity(): number {
    return this.activity;
  }

  public getPartnerPercentages(): PartnerPercentage[] {
    return this.partnerPercentages;
  }
}
