import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from '../../modules/thirdparties/thirdparty.entity';

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
}
