import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { CurrencyRate } from '../currency-rate/currency-rate.entity';

@Entity('country')
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
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.country,
  )
  thirdparties: Thirdparty[];

  @OneToMany(
    () => CurrencyRate,
    (currencyRate: CurrencyRate) => currencyRate.country,
  )
  currencyrates: Thirdparty[];
}
