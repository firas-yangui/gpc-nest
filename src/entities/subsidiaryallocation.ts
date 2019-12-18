import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { thirdparty } from './thirdparty';
import { Workload } from './workload';
import { Period } from './period';

@Entity('Subsidiaryallocation', { schema: 'public' })
@Index('subsidiary_allocation_unique_idx', ['period', 'thirdparty', 'workload'], { unique: true })
@Index('subsidiary_allocation_period_idx', ['period'])
@Index('subsidiary_allocation_workload_idx', ['workload'])
export class SubsidiaryAllocation {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.subsidiaryallocations,
    { onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: thirdparty | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'weight',
  })
  weight: number | null;

  @ManyToOne(
    () => Workload,
    (workload: Workload) => workload.subsidiaryallocations,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'workloadid' })
  workload: Workload | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.subsidiaryallocations,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'periodid' })
  period: Period | null;
}
