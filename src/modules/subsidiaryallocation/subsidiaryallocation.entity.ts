import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './../thirdparties/thirdparty.entity';
import { Workload } from './../workloads/workload.entity';
import { Period } from './../periods/period.entity';

@Entity('subsidiaryallocation')
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
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.subsidiaryAllocations,
    { onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'weight',
  })
  weight: number | null;

  @ManyToOne(
    () => Workload,
    (workload: Workload) => workload.subsidiaryAllocations,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'workloadid' })
  workload: Workload | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.subsidiaryAllocations,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'periodid' })
  period: Period | null;
}
