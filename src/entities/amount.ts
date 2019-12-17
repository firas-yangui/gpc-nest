import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { workload } from './workload';
import { period } from './period';

@Entity('amount', { schema: 'public' })
@Index('workload_period_idx', ['period', 'workload'], { unique: true })
export class Amount {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => workload,
    (workload: workload) => workload.amounts,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'workloadid' })
  workload: workload | null;

  @ManyToOne(
    () => period,
    (period: period) => period.amounts,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'periodid' })
  period: period | null;

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
}
