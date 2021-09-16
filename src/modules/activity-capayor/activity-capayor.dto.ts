import { CapayorPercentage } from './capayorpercentage.dto';

export interface ActivityCapayorInterface {
  activity: number;
  capayorPercentages: CapayorPercentage[];
}
export class ActivityCapayorDto {
  private activity: number;
  private CapayorPercentages: CapayorPercentage[];

  constructor(activityCapayor: ActivityCapayorInterface) {
    this.activity = activityCapayor.activity;
    this.CapayorPercentages = activityCapayor.capayorPercentages;
  }

  public getActivity(): number {
    return this.activity;
  }

  public getCapayorPercentages(): CapayorPercentage[] {
    return this.CapayorPercentages;
  }
}
