import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './subservice';
import { Period } from './period';
import { Phase } from './phase';
import { Storage } from './storage';

@Entity('projectreporting', { schema: 'public' })
@Index('project_reporting_unicity', ['period', 'subservice'], { unique: true })
export class ProjectReporting {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'currentprojectenddate',
  })
  currentprojectenddate: Date | null;

  @Column('text', {
    nullable: true,
    name: 'previoustrend',
  })
  previoustrend: string | null;

  @Column('text', {
    nullable: true,
    name: 'previousperiodmainevent',
  })
  previousperiodmainevent: string | null;

  @Column('text', {
    nullable: true,
    name: 'nextperiodmainevent',
  })
  nextperiodmainevent: string | null;

  @Column('text', {
    nullable: true,
    name: 'alertrisk',
  })
  alertrisk: string | null;

  @ManyToOne(
    () => SubService,
    (subservice: SubService) => subservice.projectreportings,
    {},
  )
  @JoinColumn({ name: 'subserviceid' })
  subservice: SubService | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.projectreportings,
    {},
  )
  @JoinColumn({ name: 'periodid' })
  period: Period | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'initialmainmilestonedate',
  })
  initialmainmilestonedate: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'currentmainmilestonedate',
  })
  currentmainmilestonedate: Date | null;

  @Column('text', {
    nullable: true,
    name: 'mainmilestone',
  })
  mainmilestone: string | null;

  @ManyToOne(
    () => Phase,
    (phase: Phase) => phase.projectreportings,
    {},
  )
  @JoinColumn({ name: 'phaseid' })
  phase: Phase | null;

  @Column('smallint', {
    nullable: true,
    name: 'currentstate',
  })
  currentstate: number | null;

  @Column('smallint', {
    nullable: true,
    name: 'currenttrend',
  })
  currenttrend: number | null;

  @Column('smallint', {
    nullable: true,
    name: 'progressstate',
  })
  progressstate: number | null;

  @Column('smallint', {
    nullable: true,
    name: 'budgetstate',
  })
  budgetstate: number | null;

  @ManyToOne(
    () => Storage,
    (storage: Storage) => storage.projectreportings,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'imageid' })
  image: Storage | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'initialpluriannual',
  })
  initialpluriannual: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'pluriannualreforecastho',
  })
  pluriannualreforecastho: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'pluriannualinitialibfs',
  })
  pluriannualinitialibfs: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'pluriannualactualibfs',
  })
  pluriannualactualibfs: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'pluriannualreforecastibfs',
  })
  pluriannualreforecastibfs: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'elapsedtime',
  })
  elapsedtime: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'achievement',
  })
  achievement: number | null;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'ispublished',
  })
  ispublished: boolean | null;
}
