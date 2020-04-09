import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Workload } from './../workloads/workload.entity';
import { SubNatureAppSettings } from './../subnatureappsettings/subnatureappsettings.entity';
@Entity('subnature')
@Index('subnature_code_unique_idx', ['code'], { unique: true })
export class SubNature {
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
    length: 32,
    name: 'name',
  })
  name: string;

  @Column('text', {
    nullable: false,
    default: () => "'KEURO'",
    name: 'amountunit',
  })
  amountunit: string;

  @Column('boolean', {
    nullable: true,
    default: () => 'true',
    name: 'iscashout',
  })
  iscashout: boolean | null;

  @Column('boolean', {
    nullable: false,
    default: () => 'false',
    name: 'isworkforce',
  })
  isworkforce: boolean;

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.subnature,
    { onUpdate: 'CASCADE' },
  )
  workloads: Workload[];

  @OneToMany(
    () => SubNatureAppSettings,
    (subNatureAppSettings: SubNatureAppSettings) => subNatureAppSettings.model,
    { onUpdate: 'CASCADE' },
  )
  subnatureappsettings: SubNatureAppSettings[];
}
