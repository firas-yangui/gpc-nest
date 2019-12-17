import { Column, Entity, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { Workload } from './workload';

@Entity('auto_imported_bipline', { schema: 'public' })
export class AutoImportedBipline {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 16,
    name: 'code',
  })
  code: string;

  @Column('character varying', {
    nullable: false,
    length: 16,
    name: 'period_code',
  })
  period_code: string;

  @ManyToOne(
    () => Workload,
    (workload: Workload) => workload.autoImportedBiplines,
    {},
  )
  @JoinColumn({ name: 'workloadid' })
  workload: Workload | null;
}
