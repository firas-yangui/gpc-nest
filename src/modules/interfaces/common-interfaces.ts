export interface FindAndCountInterface<E, N> extends Array<E[] | N> {
  0: E[];
  1: N;
}

export interface Thirdparty {
  id: number;
  trigram: string;
  name: string;
  thirdpartyparent?: string;
  countryid?: number;
  children?: Thirdparty[];
}

export enum PeriodType {
  notified = 'notified',
  actual = 'actual',
  sum = 'sum',
  committed = 'committed',
  budget = 'budget',
  forecast = 'forecast',
}

export interface Period {
  id: number;
  name: string;
  code: string;
  type: PeriodType;
  year: number;
  month: number;
  isarchived: boolean;
  allowtransfer: boolean;
}

export interface UnitsAmount {
  klocalcurrency: number;
  keuros: number;
  mandays: number;
  keurossales: number;
}

export interface Amount extends UnitsAmount {
  id: number;
  workloadis: number;
  periodid: number;
}

export interface ThirdpartyTree {
  id: number;
  name: string;
  trigram: string;
  children: ThirdpartyTree[];
}

export interface PeriodData {
  notified: any;
  budget: any;
  forecast: any;
}

export interface SumAmountByPeriodTypeAndBusinessPlan extends UnitsAmount {
  type: PeriodType;
}

export interface PeriodTypeAmount {
  notified?: UnitsAmount;
  actual?: UnitsAmount;
  sum?: UnitsAmount;
  committed?: UnitsAmount;
  budget?: UnitsAmount;
  forecast?: UnitsAmount;
}
export interface BusinessPlanAmount {
  RTB: PeriodTypeAmount;
  CTB: PeriodTypeAmount;
}

export interface MonthlyBusinessPlanAmount {
  month: string;
  plans: BusinessPlanAmount;
}
