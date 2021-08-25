import { ThirdPartyPercentage } from './thirdParty-percentage.dto';
export interface ActivityThirdParty {
  startDate: Date;
  endDate: Date;
  activity: number;
  thirdPartyPercentages: ThirdPartyPercentage[];
}
export class ActivityThirdPartyDto {
  private startDate: Date;
  private endDate: Date;
  private activity: number;
  private thirdPartyPercentages: ThirdPartyPercentage[];

  constructor(activityThirdPartyDto: ActivityThirdParty) {
    this.startDate = activityThirdPartyDto.startDate;
    this.endDate = activityThirdPartyDto.endDate;
    this.activity = activityThirdPartyDto.activity;
    this.thirdPartyPercentages = activityThirdPartyDto.thirdPartyPercentages;
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

  public getThirdPartyPercentages(): ThirdPartyPercentage[] {
    return this.thirdPartyPercentages;
  }
}
