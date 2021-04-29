import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubsidiaryAllocation } from '../subsidiaryallocation/subsidiaryallocation.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';

@Entity('amount_stats')
export class AmountStat {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', { name: 'workloadId', nullable: false, onUpdate: 'CASCADE' })
  workloadId: number;

  @Column('integer', { name: 'periodId', nullable: false, onUpdate: 'CASCADE' })
  periodId: number;

  @Column('integer', { name: 'thirdpartyId', nullable: false, onUpdate: 'CASCADE' })
  thirdpartyId: number;

  @Column('integer', { name: 'serviceId', nullable: false, onUpdate: 'CASCADE' })
  serviceId: number;

  @Column('integer', { name: 'subserviceId', nullable: false, onUpdate: 'CASCADE' })
  subserviceId: number;

  @Column('integer', { name: 'subnatureId', nullable: false, onUpdate: 'CASCADE' })
  subnatureId: number;

  @Column('character', { name: 'period_type', nullable: false, onUpdate: 'CASCADE' })
  periodType: string;

  @Column('character', { name: 'month', nullable: false, onUpdate: 'CASCADE' })
  month: string;

  @Column('character', { name: 'year', nullable: false, onUpdate: 'CASCADE' })
  year: string;

  @Column('character', { name: 'business_type', nullable: false, onUpdate: 'CASCADE' })
  businessType: string;

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
    name: 'keurossales',
  })
  keurossales: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'klocalcurrency',
  })
  klocalcurrency: number | null;

  @OneToMany(
    () => SubsidiaryAllocation,
    (subsidiaryAllocation: SubsidiaryAllocation) => subsidiaryAllocation.workload,
  )
  partners: SubsidiaryAllocation[];

  @ManyToOne(
    () => Thirdparty,
    thirdparty => thirdparty.amountStats,
  )
  thirdparty: Thirdparty;
}
