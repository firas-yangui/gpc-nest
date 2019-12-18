import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Period } from './period';
import { SubService } from './subservice';

@Entity('subserviceperiod', { schema: 'public' })
@Index('sub_service_period_unicity', ['period', 'subservice'], { unique: true })
export class Subserviceperiod {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'isinvested',
  })
  isinvested: boolean | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.subserviceperiods,
    { nullable: false },
  )
  @JoinColumn({ name: 'periodid' })
  period: period | null;

  @ManyToOne(
    () => SubService,
    (subservice: SubService) => subservice.subserviceperiods,
    { nullable: false },
  )
  @JoinColumn({ name: 'subserviceid' })
  subservice: SubService | null;
}
