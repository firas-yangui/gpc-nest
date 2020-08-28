import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './../thirdparties/thirdparty.entity';
import { SubNature } from './../subnature/subnature.entity';

@Entity('price')
@Index('price_unicity', ['periodtype', 'subnature', 'thirdparty'], { unique: true })
export class Price {
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
    (thirdparty: Thirdparty) => thirdparty.prices,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.prices,
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
}
