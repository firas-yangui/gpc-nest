import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Period } from './period';

@Entity('transaction_amount', { schema: 'public' })
export class TransactionAmount {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', {
    nullable: true,
    name: 'transaction_workload_id',
  })
  transaction_workload_id: number | null;

  @ManyToOne(
    () => Period,
    (period: Period) => period.transactionAmounts,
    {},
  )
  @JoinColumn({ name: 'period_id' })
  period: Period | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'amount',
  })
  amount: number | null;
}
