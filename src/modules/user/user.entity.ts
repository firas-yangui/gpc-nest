import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { GpcAppSettings } from './../gpcappsettings/gpcappsettings.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { TransactionEntity } from '../transactions/transaction.entity';
import { UserThirdpartiesAuthorizations } from './user-thirdparties-authorizations.entity';
import { Workload } from './../workloads/workload.entity';
import { Audit } from '../audit/audit.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('gpcuser')
export class User {
  @ApiProperty()
  @Column({ length: 1024 })
  firstname: string | null;

  @ApiProperty()
  @Column({ length: 1024 })
  lastname: string | null;

  @ApiProperty()
  @Column({ length: 1024 })
  servicename: string | null;

  @ApiProperty()
  @Column({ length: 1024 })
  country: string | null;

  @ApiProperty()
  @Column()
  active: boolean | null;

  @ApiProperty()
  @Column({ length: 1024 })
  realm: string | null;

  @ApiProperty()
  @Column({ length: 1024 })
  username: string | null;

  // why need password?
  //@Column({ length: 1024 })
  //password: string;

  @Column({ length: 1024 })
  credentials: string | null;

  @Column({ length: 1024 })
  challenges: string | null;

  @ApiProperty()
  @Column({ length: 1024 })
  email: string;

  @ApiProperty()
  @Column()
  emailverified: boolean | null;

  @Column({ length: 1024 })
  verificationtoken: string | null;

  @ApiProperty()
  @Column({ length: 1024 })
  status: string | null;

  @ApiProperty()
  @Column({ nullable: true })
  created: Date | null;

  @ApiProperty()
  @Column()
  lastupdated: Date | null;

  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => Thirdparty })
  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.users,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdParty: Thirdparty;

  @ApiProperty({ type: () => GpcAppSettings })
  @ManyToOne(
    () => GpcAppSettings,
    (gpcAppSettings: GpcAppSettings) => gpcAppSettings.gpcusers,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcAppSettings: GpcAppSettings;

  @ApiProperty()
  @Column()
  bipcode: string | null;

  @ApiProperty()
  @OneToMany(
    () => Audit,
    (audit: Audit) => audit.user,
    { onDelete: 'SET NULL' },
  )
  audits: Audit[];

  @ApiProperty()
  @OneToMany(
    () => UserThirdpartiesAuthorizations,
    (authorization: UserThirdpartiesAuthorizations) => authorization.user,
  )
  maxAuthorizations: UserThirdpartiesAuthorizations[];

  @ApiProperty()
  @Column('boolean', {
    nullable: true,
    name: 'ismanager',
  })
  ismanager: boolean | null;

  @ApiProperty()
  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.personincharge,
    { onDelete: 'SET NULL' },
  )
  workloads: Workload[];

  @ApiProperty()
  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.receiver,
  )
  receivedTransactions: TransactionEntity[];

  @ApiProperty()
  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.sender,
  )
  sentTransactions: TransactionEntity[];
}
