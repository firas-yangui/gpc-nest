import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from '../transaction.entity';
import { Workload } from '../../workloads/workload.entity';

@Entity('transaction_workload')
export default class TransactionWorkload {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.transactionWorkloads,
    {},
  )
  @JoinColumn({ name: 'transaction_id' })
  transaction: TransactionEntity | null;

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
