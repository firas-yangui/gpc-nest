import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './country';
import { period } from './period';

@Entity('currencyrate', { schema: 'public' })
@Index('unique_country_period_couple', ['country', 'period'], { unique: true })
export class Currencyrate {
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
    () => period,
    (period: period) => period.currencyrates,
    {},
  )
  @JoinColumn({ name: 'periodid' })
  period: period | null;

  @Column('real', {
    nullable: false,
    default: () => '1',
    precision: 24,
    name: 'value',
  })
  value: number;
}
