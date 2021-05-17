import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubsidiaryAllocation } from '../subsidiaryallocation/subsidiaryallocation.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';

@Entity('amount_stats')
export class AmountStat {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', { name: 'workloadid', nullable: false, onUpdate: 'CASCADE' })
  workloadId: number;

  @Column('integer', { name: 'thirdpartyid', nullable: false, onUpdate: 'CASCADE' })
  thirdpartyId: number;

  @Column('integer', { name: 'serviceid', nullable: false, onUpdate: 'CASCADE' })
  serviceId: number;

  @Column('integer', { name: 'subserviceid', nullable: false, onUpdate: 'CASCADE' })
  subserviceId: number;

  @Column('integer', { name: 'subnatureid', nullable: false, onUpdate: 'CASCADE' })
  subnatureId: number;

  @Column('integer', { name: 'periodid', nullable: false, onUpdate: 'CASCADE' })
  periodId: number;

  @Column('enum', {
    nullable: true,
    enum: ['notified', 'actual', 'sum', 'committed', 'budget', 'forecast'],
    name: 'period_type',
  })
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
