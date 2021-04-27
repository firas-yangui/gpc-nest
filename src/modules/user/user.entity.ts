import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GpcAppSettings } from './../gpcappsettings/gpcappsettings.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { TransactionEntity } from '../transactions/transaction.entity';
import { UserThirdpartiesAuthorizations } from './user-thirdparties-authorizations.entity';
import { Workload } from './../workloads/workload.entity';
import { Audit } from '../audit/audit.entity';

@Entity('gpcuser')
export class User {
  @Column({ length: 1024 })
  firstname: string | null;

  @Column({ length: 1024 })
  lastname: string | null;

  @Column({ length: 1024 })
  servicename: string | null;

  @Column({ length: 1024 })
  country: string | null;

  @Column()
  active: boolean | null;

  @Column({ length: 1024 })
  realm: string | null;

  @Column({ length: 1024 })
  username: string | null;

  @Column({ length: 1024 })
  password: string;

  @Column({ length: 1024 })
  credentials: string | null;

  @Column({ length: 1024 })
  challenges: string | null;

  @Column({ length: 1024 })
  email: string;

  @Column()
  emailverified: boolean | null;

  @Column({ length: 1024 })
  verificationtoken: string | null;

  @Column({ length: 1024 })
  status: string | null;

  @Column({ nullable: true })
  created: Date | null;

  @Column()
  lastupdated: Date | null;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.users,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdParty: Thirdparty;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcAppSettings: GpcAppSettings) => gpcAppSettings.gpcusers,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcAppSettings: GpcAppSettings;

  @Column()
  bipcode: string | null;

  @OneToMany(
    () => Audit,
    (audit: Audit) => audit.user,
    { onDelete: 'SET NULL' },
  )
  audits: Audit[];

  @OneToMany(
    () => UserThirdpartiesAuthorizations,
    (authorization: UserThirdpartiesAuthorizations) => authorization.user,
  )
  maxAuthorizations: UserThirdpartiesAuthorizations[];

  @Column('boolean', {
    nullable: true,
    name: 'ismanager',
  })
  ismanager: boolean | null;

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.personincharge,
    { onDelete: 'SET NULL' },
  )
  workloads: Workload[];

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.receiver,
  )
  receivedTransactions: TransactionEntity[];

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.sender,
  )
  sentTransactions: TransactionEntity[];
}
