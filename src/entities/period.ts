import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';
import { sourcingplan } from './sourcingplan';
import { periodappsettings } from './periodappsettings';
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
    () => sourcingplan,
    (sourcingplan: sourcingplan) => sourcingplan.period,
  )
  sourcingplans: sourcingplan[];

  @OneToMany(
    () => periodappsettings,
    (periodappsettings: periodappsettings) => periodappsettings.model,
  )
  periodappsettingss: periodappsettings[];

  @OneToMany(
    () => currencyrate,
    (currencyrate: currencyrate) => currencyrate.period,
  )
  currencyrates: currencyrate[];

  @OneToMany(
    () => transaction_amount,
    (transaction_amount: transaction_amount) => transaction_amount.period,
  )
  transactionAmounts: transaction_amount[];

  @OneToMany(
    () => subsidiaryallocation,
    (subsidiaryallocation: subsidiaryallocation) => subsidiaryallocation.period,
    { onUpdate: 'CASCADE' },
  )
  subsidiaryallocations: subsidiaryallocation[];

  @OneToMany(
    () => amount,
    (amount: amount) => amount.period,
    { onUpdate: 'CASCADE' },
  )
  amounts: amount[];

  @OneToMany(
    () => subserviceperiod,
    (subserviceperiod: subserviceperiod) => subserviceperiod.period,
  )
  subserviceperiods: subserviceperiod[];

  @OneToMany(
    () => projectreporting,
    (projectreporting: projectreporting) => projectreporting.period,
  )
  projectreportings: projectreporting[];
}
