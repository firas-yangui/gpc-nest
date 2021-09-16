import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Amount } from './../amounts/amount.entity';
import { CurrencyRate } from './../currency-rate/currency-rate.entity';
import { PeriodAppSettings } from './periodappsettings/periodappsettings.entity';
import { SubsidiaryAllocation } from './../subsidiaryallocation/subsidiaryallocation.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('period')
@Index('period_code_uniqueness', ['code'], { unique: true })
@Index('period_name_unique_idx', ['name'], { unique: true })
export class Period {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  @ApiProperty()
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 32,
    name: 'name',
  })
  @ApiProperty()
  name: string;

  @Column('text', {
    nullable: false,
    unique: true,
    name: 'code',
  })
  @ApiProperty()
  code: string;

  @Column('enum', {
    nullable: true,
    enum: ['notified', 'actual', 'sum', 'committed', 'budget', 'forecast'],
    name: 'type',
  })
  @ApiProperty()
  type: string | null;

  @Column('text', {
    nullable: true,
    name: 'year',
  })
  @ApiProperty()
  year: string | null;

  @Column('text', {
    nullable: true,
    name: 'month',
  })
  @ApiProperty()
  month: string | null;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'isarchived',
  })
  @ApiProperty()
  isarchived: boolean | null;

  @Column('boolean', {
    nullable: false,
    default: () => 'false',
    name: 'allowtransfer',
  })
  @ApiProperty()
  allowtransfer: boolean;

  @OneToMany(
    () => Amount,
    (amount: Amount) => amount.period,
    { onUpdate: 'CASCADE' },
  )
  amounts: Amount[];

  @OneToMany(
    () => CurrencyRate,
    (currencyRate: CurrencyRate) => currencyRate.period,
    { onUpdate: 'CASCADE' },
  )
  currencyrates: CurrencyRate[];

  @OneToMany(
    () => PeriodAppSettings,
    (periodappsettings: PeriodAppSettings) => periodappsettings.period,
  )
  periodappsettings: PeriodAppSettings[];

  @OneToMany(
    () => SubsidiaryAllocation,
    (subsidiaryAllocation: SubsidiaryAllocation) => subsidiaryAllocation.period,
    { onUpdate: 'CASCADE' },
  )
  subsidiaryAllocations: SubsidiaryAllocation[];

  @Column('boolean', {
    nullable: false,
    default: () => 'false',
    name: 'iscampaignperiod',
  })
  @ApiProperty()
  iscampaignperiod: boolean;
}
