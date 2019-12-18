import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Stake } from './stake';
import { Phase } from './phase';

@Entity('parameter', { schema: 'public' })
export class Parameter {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'stakename',
  })
  stakename: string | null;

  @ManyToOne(
    () => Stake,
    (stake: Stake) => stake.parameters,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'stakeid' })
  stake: Stake | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'phasename',
  })
  phasename: string | null;

  @ManyToOne(
    () => Phase,
    (phase: Phase) => phase.parameters,
    {},
  )
  @JoinColumn({ name: 'phaseid' })
  phase: Phase | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'axisname',
  })
  axisname: string | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'targetaxis',
  })
  targetaxis: string | null;
}
