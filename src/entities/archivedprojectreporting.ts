import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivedprojectreporting', { schema: 'public' })
export class ArchivedProjectReporting {
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

  @Column('integer', {
    nullable: true,
    name: 'subserviceid',
  })
  subserviceid: number | null;

  @Column('integer', {
    nullable: true,
    name: 'periodid',
  })
  periodid: number | null;

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

  @Column('integer', {
    nullable: true,
    name: 'phaseid',
  })
  phaseid: number | null;

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

  @Column('integer', {
    nullable: true,
    name: 'imageid',
  })
  imageid: number | null;

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
