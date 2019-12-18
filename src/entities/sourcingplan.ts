import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './thirdparty';
import { SubNature } from './subnature';
import { Period } from './period';

@Entity('sourcingplan', { schema: 'public' })
export class SourcingPlan {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 3,
    name: 'type',
  })
  type: string;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'value',
  })
  value: number | null;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.sourcingplans,
    {},
  )
  @JoinColumn({ name: 'childthirdpartyid' })
  childthirdparty: thirdparty | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.sourcingplans2,
    {},
  )
  @JoinColumn({ name: 'parentthirdpartyid' })
  parentthirdparty: Thirdparty | null;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.sourcingplans,
    {},
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: SubNature | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.sourcingplans,
    {},
  )
  @JoinColumn({ name: 'periodid' })
  period: Period | null;
}
