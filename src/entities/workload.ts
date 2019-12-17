import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './thirdparty';
import { SubNature } from './subnature';
import { SubService } from './subservice';
import { GpcUser } from './gpcuser';
import { Amount } from './amount';
import { SubsidiaryAllocation } from './subsidiaryallocation';
import { AutoImportedBipline } from './auto_imported_bipline';
import { TransactionWorkload } from './transaction_workload';

@Entity('Workload', { schema: 'public' })
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
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.workloads,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: thirdparty | null;

  @ManyToOne(
    () => subnature,
    (subnature: subnature) => subnature.workloads,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: subnature | null;

  @ManyToOne(
    () => subservice,
    (subservice: subservice) => subservice.workloads,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subserviceid' })
  subservice: subservice | null;

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
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.workloads,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'personinchargeid' })
  personincharge: gpcuser | null;

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
    () => subsidiaryallocation,
    (subsidiaryallocation: subsidiaryallocation) => subsidiaryallocation.workload,
    { onUpdate: 'CASCADE' },
  )
  subsidiaryallocations: subsidiaryallocation[];

  @OneToMany(
    () => AutoImportedBipline,
    (auto_imported_bipline: AutoImportedBipline) => auto_imported_bipline.workload,
  )
  autoImportedBiplines: AutoImportedBipline[];

  @OneToMany(
    () => transaction_workload,
    (transaction_workload: TransactionWorkload) => transaction_workload.workload,
  )
  transactionWorkloads: TransactionWorkload[];
}
