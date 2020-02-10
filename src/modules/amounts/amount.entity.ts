import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Workload } from './../workloads/workload.entity';
import { Period } from './../periods/period.entity';

@Entity('amount')
@Index('workload_period_idx', ['period', 'workload'], { unique: true })
export class Amount {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'mandays',
  })
  mandays: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'keuros',
  })
  keuros: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'klocalcurrency',
  })
  klocalcurrency: number | null;

  @Column('character varying', {
    nullable: true,
    length: 16,
    name: 'status',
  })
  status: string | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'keurossales',
  })
  keurossales: number | null;

  @ManyToOne(
    () => Workload,
    (workload: Workload) => workload.amounts,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'workloadid' })
  workload: Workload | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.amounts,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'periodid' })
  period: Period | null;
}
