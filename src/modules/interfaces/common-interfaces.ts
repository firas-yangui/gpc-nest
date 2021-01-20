import { Type } from '@nestjs/common';
import { Timestamp } from 'typeorm';

export interface FindAndCountInterface<E, N> extends Array<E[] | N> {
  0: E[];
  1: N;
}

export interface Thirdparty {
  id: number;
  trigram: string;
  radical: string;
  name: string;
  thirdpartyparent?: string;
  countryid?: number;
  children?: Thirdparty[];
}

export interface Subnatureappsetting {
  id: number;
  dfincode: string;
  nrgcode: string;
  model?: number;
}

export interface Service {
  id: number;
  code: string;
  name: string;
  lastupdatedate: string;
  description: string;
  subservices: SubService[];
}

export interface SubService {
  id: number;
  code: string;
  name: string;
  description: string;
}

export enum PeriodType {
  notified = 'notified',
  actual = 'actual',
  sum = 'sum',
  committed = 'committed',
  budget = 'budget',
  forecast = 'forecast',
}

export enum WorkloadStatus {
  running = 'RUNNING',
  closed = 'CLOSED',
  pending = 'PENDING',
  draft = 'DRAFT',
  arbitrated = 'ARBITRATED',
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

export type Unit = 'mandays' | 'keuros' | 'keurossales' | 'klocalcurrency';

export interface UnitsAmount {
  klocalcurrency: number;
  keuros: number;
  mandays: number;
  keurossales: number;
}

export interface Amount extends UnitsAmount {
  id?: number;
  workload: any;
  period: any;
  status?: string;
}

export interface RawAmount extends UnitsAmount {
  id?: number;
  workloadid: number;
  periodid: number;
  datasource: string;
  created?: Timestamp;
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

export default interface EnvConfigInterface {
  [key: string]: string;
}

export interface RabbitMQConnectOptions {
  host: string;
  port: number;
  user: string;
  password: string;
  vhost?: string;
}

export interface RabbitMQOptionsFactory {
  createRabbitMQConnectOptions(): Promise<RabbitMQConnectOptions> | RabbitMQConnectOptions | Promise<string> | string;
}

export interface RabbitMQConnectAsyncOptions {
  inject?: any[];
  useExisting?: Type<any>;
  useClass?: Type<any>;
  useFactory?: (...args: any[]) => Promise<RabbitMQConnectOptions> | RabbitMQConnectOptions;
}

export interface Workload {
  id: number;
  code?: string;
  description?: string;
  status?: string;
  thirdpartyid?: string;
  subnatureid?: string;
  subserviceid?: string;
}
