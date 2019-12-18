import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './thirdparty';
import { SubNature } from './subnature';

@Entity('mixsourcingstandard', { schema: 'public' })
export class MixSourcingStandard {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.mixsourcingstandards,
    {},
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.mixsourcingstandards,
    {},
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: SubNature | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'percent',
  })
  percent: number | null;
}
