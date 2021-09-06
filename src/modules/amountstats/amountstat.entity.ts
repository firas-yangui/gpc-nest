import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ServiceDto } from '../services/services.entity';
import { SubService } from '../subservices/subservice.entity';
import { SubsidiaryAllocation } from '../subsidiaryallocation/subsidiaryallocation.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { Workload } from '../workloads/workload.entity';

@Entity('amountstats')
export class AmountStat {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

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
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty;

  @ManyToOne(
    () => ServiceDto,
    service => service.amountStats,
  )
  @JoinColumn({ name: 'serviceid' })
  service: ServiceDto;

  @ManyToOne(
    () => SubService,
    subservice => subservice.amountStats,
  )
  @JoinColumn({ name: 'subserviceid' })
  subservice: SubService;

  @ManyToOne(
    () => Workload,
    workload => workload.amountStats,
  )
  @JoinColumn({ name: 'workloadid' })
  workload: Workload;
}
