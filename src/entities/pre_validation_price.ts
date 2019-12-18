import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './thirdparty';
import { SubNature } from './subnature';

@Entity('pre_validation_price', { schema: 'public' })
export class PreValidationPrice {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'price',
  })
  price: number | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.preValidationPrices,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.preValidationPrices,
    { nullable: false },
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: SubNature | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'saleprice',
  })
  saleprice: number | null;

  @Column('enum', {
    nullable: false,
    default: () => "'budget'",
    enum: ['notified', 'actual', 'sum', 'committed', 'budget', 'forecast'],
    name: 'periodtype',
  })
  periodtype: string;

  @Column('date', {
    nullable: true,
    name: 'updatedate',
  })
  updatedate: string | null;

  @Column('text', {
    nullable: false,
    name: 'user_id',
  })
  user_id: string;
}
