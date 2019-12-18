import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { CurrencyRate } from './currencyrate';
import { Thirdparty } from './thirdparty';

@Entity('country', { schema: 'public' })
export class Country {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'defaultcountry',
  })
  defaultcountry: boolean | null;

  @OneToMany(
    () => CurrencyRate,
    (currencyrate: CurrencyRate) => currencyrate.country,
  )
  currencyrates: CurrencyRate[];

  @OneToMany(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.country,
  )
  thirdpartys: Thirdparty[];
}
