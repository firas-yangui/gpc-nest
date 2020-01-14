import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { User } from '../user/user.entity';

import { Workload } from './../workloads/workload.entity';

@Entity('thirdparty', { schema: 'public' })
export class Thirdparty {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'radical',
  })
  radical: string;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'trigram',
  })
  trigram: string | null;

  @Column('character varying', {
    nullable: true,
    length: 30,
    name: 'thirdpartyparent',
  })
  thirdpartyparent: string | null;

  @Column('integer', {
    nullable: false,
    name: 'countryid',
  })
  countryid: number;

  @OneToMany(
    () => TransactionEntity,
    (transaction: TransactionEntity) => transaction.targetThirdParty,
  )
  transactions: TransactionEntity[];

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.thirdparty,
  )
  workloads: Workload[];

  @OneToMany(
    () => User,
    (user: User) => user.thirdParty,
  )
  users: User[];

  @OneToMany(
    () => User,
    (user: User) => user.maxReadThirdParty,
  )
  readers: User[];

  @OneToMany(
    () => User,
    (user: User) => user.maxEditThirdParty,
  )
  editors: User[];
}
