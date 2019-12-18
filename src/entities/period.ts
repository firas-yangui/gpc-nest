import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { SourcingPlan } from './sourcingplan';
import { PeriodAppSettings } from './periodappsettings';
import { CurrencyRate } from './currencyrate';
import { TransactionAmount } from './transaction_amount';
import { SubsidiaryAllocation } from './subsidiaryallocation';
import { Amount } from './amount';
import { SubServicePeriod } from './subserviceperiod';
import { ProjectReporting } from './projectreporting';

@Entity('period', { schema: 'public' })
@Index('period_code_uniqueness', ['code'], { unique: true })
@Index('period_name_unique_idx', ['name'], { unique: true })
export class Period {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 32,
    name: 'name',
  })
  name: string;

  @Column('text', {
    nullable: false,
    unique: true,
    name: 'code',
  })
  code: string;

  @Column('enum', {
    nullable: true,
    enum: ['notified', 'actual', 'sum', 'committed', 'budget', 'forecast'],
    name: 'type',
  })
  type: string | null;

  @Column('text', {
    nullable: true,
    name: 'year',
  })
  year: string | null;

  @Column('text', {
    nullable: true,
    name: 'month',
  })
  month: string | null;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'isarchived',
  })
  isarchived: boolean | null;

  @Column('boolean', {
    nullable: false,
    default: () => 'false',
    name: 'allowtransfer',
  })
  allowtransfer: boolean;

  @OneToMany(
    () => SourcingPlan,
    (sourcingplan: SourcingPlan) => sourcingplan.period,
  )
  sourcingplans: SourcingPlan[];

  @OneToMany(
    () => PeriodAppSettings,
    (periodappsettings: PeriodAppSettings) => periodappsettings.model,
  )
  periodappsettingss: PeriodAppSettings[];

  @OneToMany(
    () => CurrencyRate,
    (currencyrate: CurrencyRate) => currencyrate.period,
  )
  currencyrates: CurrencyRate[];

  @OneToMany(
    () => TransactionAmount,
    (transaction_amount: TransactionAmount) => transaction_amount.period,
  )
  transactionAmounts: TransactionAmount[];

  @OneToMany(
    () => SubsidiaryAllocation,
    (subsidiaryallocation: SubsidiaryAllocation) => subsidiaryallocation.period,
    { onUpdate: 'CASCADE' },
  )
  subsidiaryallocations: SubsidiaryAllocation[];

  @OneToMany(
    () => Amount,
    (amount: Amount) => amount.period,
    { onUpdate: 'CASCADE' },
  )
  amounts: Amount[];

  @OneToMany(
    () => SubServicePeriod,
    (subserviceperiod: SubServicePeriod) => subserviceperiod.period,
  )
  subserviceperiods: SubServicePeriod[];

  @OneToMany(
    () => ProjectReporting,
    (projectreporting: ProjectReporting) => projectreporting.period,
  )
  projectreportings: ProjectReporting[];
}
