import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './thirdparty';
import { Service } from './service';
import { SubTypology } from './subtypology';
import { Stake } from './stake';
import { IrtApplication } from './irtapplication';
import { Portfolio } from './portfolio';
import { phase } from './phase';
import { program } from './program';
import { workload } from './workload';
import { subserviceperiod } from './subserviceperiod';
import { transaction } from './transaction';
import { projectreporting } from './projectreporting';

@Entity('subservice', { schema: 'public' })
export class SubService {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'code',
  })
  code: string;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.subservices,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @ManyToOne(
    () => Service,
    (service: Service) => service.subservices,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'serviceid' })
  service: Service | null;

  @ManyToOne(
    () => SubTypology,
    (subtypology: SubTypology) => subtypology.subservices,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subtypologyid' })
  subtypology: SubTypology | null;

  @Column('text', {
    nullable: true,
    name: 'description',
  })
  description: string | null;

  @ManyToOne(
    () => Stake,
    (stake: Stake) => stake.subservices,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'stakeid' })
  stake: Stake | null;

  @ManyToOne(
    () => IrtApplication,
    (irtapplication: IrtApplication) => irtapplication.subservices,
    { onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'irtapplicationid' })
  irtapplication: IrtApplication | null;

  @ManyToOne(
    () => portfolio,
    (portfolio: portfolio) => portfolio.subservices,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'portfolioid' })
  portfolio: portfolio | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'startingdate',
  })
  startingdate: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'validationdate',
  })
  validationdate: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'affectationdate',
  })
  affectationdate: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'scopingenddate',
  })
  scopingenddate: Date | null;

  @Column('text', {
    nullable: true,
    name: 'englishname',
  })
  englishname: string | null;

  @Column('text', {
    nullable: true,
    name: 'historicalid',
  })
  historicalid: string | null;

  @Column('text', {
    nullable: true,
    name: 'pmo',
  })
  pmo: string | null;

  @ManyToOne(
    () => phase,
    (phase: phase) => phase.subservices,
    {},
  )
  @JoinColumn({ name: 'phaseid' })
  phase: phase | null;

  @Column('text', {
    nullable: true,
    name: 'englishdescription',
  })
  englishdescription: string | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'initialenddate',
  })
  initialenddate: Date | null;

  @Column('text', {
    nullable: true,
    name: 'axis',
  })
  axis: string | null;

  @Column('text', {
    nullable: true,
    name: 'priority',
  })
  priority: string | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'lasteditdate',
  })
  lasteditdate: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'laststeeringcomittee',
  })
  laststeeringcomittee: Date | null;

  @Column('text', {
    nullable: true,
    name: 'sponsor',
  })
  sponsor: string | null;

  @Column('text', {
    nullable: true,
    name: 'projectmanager',
  })
  projectmanager: string | null;

  @Column('text', {
    nullable: true,
    name: 'itresponsible',
  })
  itresponsible: string | null;

  @Column('text', {
    nullable: true,
    name: 'businessmanager',
  })
  businessmanager: string | null;

  @Column('text', {
    nullable: true,
    name: 'tags',
  })
  tags: string | null;

  @Column('text', {
    nullable: true,
    name: 'linkedprojects',
  })
  linkedprojects: string | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'currentprojectenddate',
  })
  currentprojectenddate: Date | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'initialbudget',
  })
  initialbudget: number | null;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'var1',
  })
  var1: string | null;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'var2',
  })
  var2: string | null;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'var3',
  })
  var3: string | null;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'var4',
  })
  var4: string | null;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'var5',
  })
  var5: string | null;

  @Column('character varying', {
    nullable: true,
    length: 32,
    name: 'cacode',
  })
  cacode: string | null;

  @ManyToOne(
    () => program,
    (program: program) => program.subservices,
    {},
  )
  @JoinColumn({ name: 'programid' })
  program: program | null;

  @Column('character varying', {
    nullable: true,
    length: 50,
    name: 'applicant',
  })
  applicant: string | null;

  @Column('enum', {
    nullable: true,
    enum: ['MASTERPLAN_LOCAL', 'MASTERPLAN_REGIONAL', 'MASTERPLAN_BU', 'MASTERPLAN_GROUP'],
    name: 'itmasterplan',
  })
  itmasterplan: string | null;

  @OneToMany(
    () => workload,
    (workload: workload) => workload.subservice,
    { onUpdate: 'CASCADE' },
  )
  workloads: workload[];

  @OneToMany(
    () => subserviceperiod,
    (subserviceperiod: subserviceperiod) => subserviceperiod.subservice,
  )
  subserviceperiods: subserviceperiod[];

  @OneToMany(
    () => transaction,
    (transaction: transaction) => transaction.subservice,
  )
  transactions: transaction[];

  @OneToMany(
    () => projectreporting,
    (projectreporting: projectreporting) => projectreporting.subservice,
  )
  projectreportings: projectreporting[];
}
