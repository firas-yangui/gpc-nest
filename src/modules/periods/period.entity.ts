import { Column, Entity, Index, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Amount } from './../amounts/amount.entity';
import { CurrencyRate } from './../currency-rate/currency-rate.entity';

@Entity('period')
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
}
