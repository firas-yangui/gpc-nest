import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './country';
import { Period } from './period';

@Entity('currencyrate', { schema: 'public' })
@Index('unique_country_period_couple', ['country', 'period'], { unique: true })
export class CurrencyRate {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Country,
    (country: Country) => country.currencyrates,
    {},
  )
  @JoinColumn({ name: 'countryid' })
  country: Country | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.currencyrates,
    {},
  )
  @JoinColumn({ name: 'periodid' })
  period: Period | null;

  @Column('real', {
    nullable: false,
    default: () => '1',
    precision: 24,
    name: 'value',
  })
  value: number;
}
