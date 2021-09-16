import { ThirdPartyPercentage } from './thirdParty-percentage.dto';

export interface ActivityThirdParty {
  activity: number;
  thirdPartyPercentages: ThirdPartyPercentage[];
}
export class ActivityThirdPartyDto {
  private activity: number;
  private thirdPartyPercentages: ThirdPartyPercentage[];

  constructor(activityThirdParty: ActivityThirdParty) {
    this.activity = activityThirdParty.activity;
    this.thirdPartyPercentages = activityThirdParty.thirdPartyPercentages;
  }

  public getActivity(): number {
    return this.activity;
  }

  public getThirdPartyPercentages(): ThirdPartyPercentage[] {
    return this.thirdPartyPercentages;
  }
}
