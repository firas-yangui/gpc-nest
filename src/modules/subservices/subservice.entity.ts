import { Column, Entity, ManyToOne, OneToMany, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { Workload } from './../workloads/workload.entity';
import { Subtypology } from './../subtypologies/subtypology.entity';
import { ServiceDto } from './../services/services.entity';
import { Portfolio } from './../portfolio/portfolio.entity';
import { AmountStat } from '../amountstats/amountstat.entity';
import { IrtApplication } from '../irtapplication/irtapplication.entity';

@Entity('subservice')
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

  @Column('integer', {
    nullable: false,
    name: 'thirdpartyid',
  })
  thirdpPartyId: number;

  @Column('text', {
    nullable: true,
    name: 'description',
  })
  description: string | null;

  @Column('integer', {
    nullable: true,
    name: 'stakeid',
  })
  stakeId: number;

  @Column('integer', {
    nullable: true,
    name: 'irtapplicationid',
  })
  irtApplicationId: number;

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

  @Column('integer', {
    nullable: true,
    name: 'phaseid',
  })
  phaseId: number;

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

  @Column('integer', {
    nullable: true,
    name: 'programid',
  })
  programId: number;

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
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.subService,
  )
  transactions: TransactionEntity[];

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.subservice,
  )
  workloads: Workload[];

  @ManyToOne(
    () => Subtypology,
    (subtypology: Subtypology) => subtypology.subservices,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subtypologyid' })
  subtypology: Subtypology;

  @ManyToOne(
    () => ServiceDto,
    (service: ServiceDto) => service.subservices,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'serviceid' })
  service: ServiceDto | null;

  @ManyToOne(
    () => Portfolio,
    (portfolio: Portfolio) => portfolio.subservices,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'portfolioid' })
  portfolio: ServiceDto | null;

  @OneToMany(
    () => AmountStat,
    (amountStats: AmountStat) => amountStats.subservice,
  )
  amountStats: AmountStat[];

  // IRT application
  @ManyToOne(
    () => IrtApplication,
    irtApplication => irtApplication.subservices,
  )
  @JoinColumn({ name: 'irtapplicationid' })
  irtApplication: IrtApplication;
}
