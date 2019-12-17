import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { thirdparty } from './thirdparty';
import { Gpcappsettings } from './gpcappsettings';
import { transaction } from './transaction';
import { Bipline } from './bipline';
import { Workload } from './workload';
import { Audit } from './audit';
import { Allocationline } from './allocationline';

@Entity('gpcuser', { schema: 'public' })
export class GpcUser {
  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'firstname',
  })
  firstname: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'lastname',
  })
  lastname: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'servicename',
  })
  servicename: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'country',
  })
  country: string | null;

  @Column('boolean', {
    nullable: true,
    name: 'active',
  })
  active: boolean | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'realm',
  })
  realm: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'username',
  })
  username: string | null;

  @Column('character varying', {
    nullable: false,
    length: 1024,
    name: 'password',
  })
  password: string;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'credentials',
  })
  credentials: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'challenges',
  })
  challenges: string | null;

  @Column('character varying', {
    nullable: false,
    length: 1024,
    name: 'email',
  })
  email: string;

  @Column('boolean', {
    nullable: true,
    name: 'emailverified',
  })
  emailverified: boolean | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'verificationtoken',
  })
  verificationtoken: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'status',
  })
  status: string | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'created',
  })
  created: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'lastupdated',
  })
  lastupdated: Date | null;

  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.gpcusers3,
    { onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: thirdparty | null;

  @Column('text', {
    nullable: true,
    name: 'bipcode',
  })
  bipcode: string | null;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.gpcusers2,
    {},
  )
  @JoinColumn({ name: 'maxreadthirdpartyid' })
  maxreadthirdparty: thirdparty | null;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.gpcusers,
    {},
  )
  @JoinColumn({ name: 'maxeditthirdpartyid' })
  maxeditthirdparty: thirdparty | null;

  @ManyToOne(
    () => Gpcappsettings,
    (gpcappsettings: Gpcappsettings) => gpcappsettings.gpcusers,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: Gpcappsettings | null;

  @Column('boolean', {
    nullable: true,
    name: 'ismanager',
  })
  ismanager: boolean | null;

  @OneToMany(
    () => transaction,
    (transaction: transaction) => transaction.userSender,
  )
  transactions: transaction[];

  @OneToMany(
    () => Bipline,
    (bipline: Bipline) => bipline.gpcuser,
    { onDelete: 'CASCADE' },
  )
  biplines: Bipline[];

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.personincharge,
    { onDelete: 'SET NULL' },
  )
  workloads: Workload[];

  @OneToMany(
    () => Audit,
    (audit: Audit) => audit.user,
    { onDelete: 'SET NULL' },
  )
  audits: Audit[];

  @OneToMany(
    () => Allocationline,
    (allocationline: Allocationline) => allocationline.gpcuser,
    { onDelete: 'CASCADE' },
  )
  allocationlines: Allocationline[];

  @OneToMany(
    () => transaction,
    (transaction: transaction) => transaction.userReceiver,
  )
  transactions2: transaction[];
}
