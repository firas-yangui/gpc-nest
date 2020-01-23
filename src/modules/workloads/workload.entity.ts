import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { SubNature } from './../subnature/subnature.entity';
import { SubService } from './../subservices/subservice.entity';
import { User as gpcUser } from './../user/user.entity';
import { Amount } from './../amounts/amount.entity';
import TransactionWorkload from './../transactions/transaction-workloads/transaction-workload.entity';
@Entity('workload', { schema: 'public' })
@Index('workload_code_idx', ['code'], { unique: true })
export class Workload {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 50,
    name: 'code',
  })
  code: string;

  @Column('character varying', {
    nullable: true,
    length: 32,
    name: 'description',
  })
  description: string | null;

  @Column('character varying', {
    nullable: false,
    length: 16,
    name: 'status',
  })
  status: string;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.workloads,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.workloads,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: SubNature | null;

  @ManyToOne(
    () => SubService,
    (subservice: SubService) => subservice.workloads,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subserviceid' })
  subservice: SubService | null;

  @Column('text', {
    nullable: true,
    name: 'largedescription',
  })
  largedescription: string | null;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'isenvelope',
  })
  isenvelope: boolean | null;

  @Column('boolean', {
    nullable: true,
    name: 'isinvested',
  })
  isinvested: boolean | null;

  @ManyToOne(
    () => gpcUser,
    (gpcuser: gpcUser) => gpcuser.workloads,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'personinchargeid' })
  personincharge: gpcUser | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'lasteditdate',
  })
  lasteditdate: Date | null;

  @OneToMany(
    () => Amount,
    (amount: Amount) => amount.workload,
    { onUpdate: 'CASCADE' },
  )
  amounts: Amount[];

  @OneToMany(
    () => TransactionWorkload,
    (transactionWorkload: TransactionWorkload) => transactionWorkload.workload,
  )
  transactionWorkloads: TransactionWorkload[];
}
