import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { currencyrate } from './currencyrate';
import { thirdparty } from './thirdparty';

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
    () => currencyrate,
    (currencyrate: currencyrate) => currencyrate.country,
  )
  currencyrates: currencyrate[];

  @OneToMany(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.country,
  )
  thirdpartys: thirdparty[];
}
