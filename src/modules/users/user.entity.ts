import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';

@Entity('gpcuser')
export class UserEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', { nullable: true, name: 'firstname' })
  firstName: string | null;

  @Column('character varying', { nullable: true, name: 'lastname' })
  lastName: string | null;

  @Column('character varying', { nullable: true, name: 'servicename' })
  serviceName: string | null;

  @Column('character varying', { nullable: true, name: 'country' })
  country: string | null;

  @Column('boolean', { nullable: true, name: 'active' })
  active: boolean | null;

  @Column('character varying', { nullable: true, name: 'realm' })
  realm: string | null;

  @Column('character varying', { nullable: true, name: 'username' })
  userName: string | null;

  @Column('character varying', { nullable: true, name: 'password' })
  password: string | null;

  @Column('character varying', { nullable: true, name: 'credentials' })
  credentials: string | null;

  @Column('character varying', { nullable: true, name: 'challenges' })
  challenges: string | null;

  @Column('character varying', { nullable: true, name: 'email' })
  email: string | null;

  @Column('boolean', { nullable: true, name: 'emailverified' })
  emailVerified: boolean | null;

  @Column('character varying', { nullable: true, name: 'verificationtoken' })
  verificationToken: string | null;

  @Column('character varying', { nullable: true, name: 'status' })
  status: string | null;

  @Column('timestamp with time zone', { nullable: true, name: 'created' })
  created: Date | null;

  @Column('timestamp with time zone', { nullable: true, name: 'lastupdated' })
  lastUpdated: Date | null;

  @Column('integer', { nullable: false, name: 'thirdpartyid' })
  thirdPartyId: number;

  @Column('text', { nullable: false, name: 'bipcode' })
  bipCode: string;

  @Column('integer', { nullable: false, name: 'maxreadthirdpartyid' })
  maxReadThirdPartyId: number;

  @Column('integer', { nullable: false, name: 'maxeditthirdpartyid' })
  maxEditThirdPartyId: number;

  @Column('integer', { nullable: false, name: 'gpcappsettingsid' })
  gpcAppSettingsId: number;

  @Column('boolean', { nullable: true, name: 'ismanager' })
  isManager: boolean | null;

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
