import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { subservice } from './subservice';
import { thirdparty } from './thirdparty';
import { GpcUser } from './gpcuser';
import { TransactionWorkload } from './transaction_workload';

@Entity('transaction', { schema: 'public' })
export class Transaction {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => subservice,
    (subservice: subservice) => subservice.transactions,
    {},
  )
  @JoinColumn({ name: 'subservice_id' })
  subservice: subservice | null;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.transactions,
    {},
  )
  @JoinColumn({ name: 'target_thirdparty_id' })
  targetThirdparty: thirdparty | null;

  @ManyToOne(
    () => GpcUser,
    (gpcuser: GpcUser) => gpcuser.transactions,
    {},
  )
  @JoinColumn({ name: 'user_sender' })
  userSender: GpcUser | null;

  @ManyToOne(
    () => GpcUser,
    (gpcuser: GpcUser) => gpcuser.transactions2,
    {},
  )
  @JoinColumn({ name: 'user_receiver' })
  userReceiver: GpcUser | null;

  @Column('enum', {
    nullable: true,
    enum: ['inprogress', 'processed', 'rejected'],
    name: 'status',
  })
  status: string | null;

  @Column('enum', {
    nullable: true,
    enum: ['KEURO', 'KEURO_SALES', 'MD', 'KLC'],
    name: 'unit',
  })
  unit: string | null;

  @Column('timestamp without time zone', {
    nullable: true,
    default: () => 'now()',
    name: 'created_date',
  })
  created_date: Date | null;

  @Column('timestamp without time zone', {
    nullable: true,
    name: 'received_date',
  })
  received_date: Date | null;

  @Column('timestamp without time zone', {
    nullable: true,
    name: 'rejected_date',
  })
  rejected_date: Date | null;

  @OneToMany(
    () => TransactionWorkload,
    (transactionWorkload: TransactionWorkload) => transactionWorkload.transaction,
  )
  transactionWorkloads: TransactionWorkload[];
}
