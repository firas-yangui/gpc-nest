import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Transaction } from './transaction';
import { Workload } from './workload';

@Entity('transaction_workload', { schema: 'public' })
export class TransactionWorkload {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Transaction,
    (transaction: Transaction) => transaction.transactionWorkloads,
    {},
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: Transaction | null;

  @ManyToOne(
    () => Workload,
    (workload: Workload) => workload.transactionWorkloads,
    {},
  )
  @JoinColumn({ name: 'workload_id' })
  workload: Workload | null;

  @Column('enum', {
    nullable: true,
    enum: ['SENDER', 'RECEIVER'],
    name: 'source',
  })
  source: string | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'amount_to_transfer',
  })
  amount_to_transfer: number | null;
}
