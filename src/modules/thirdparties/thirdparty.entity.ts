import { Column, Entity, OneToMany, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';
import { User } from '../user/user.entity';
import { UserThirdpartiesAuthorizations } from '../user/user-thirdparties-authorizations.entity';
import { Thirdpartyappsettings } from './thirdpartyappsettings/thirdpartyappsettings.entity';
import { Country } from './../country/country.entity';

import { Workload } from '../workloads/workload.entity';
import { Type } from 'class-transformer';

@Entity('thirdparty')
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

  @Column('character varying', {
    nullable: true,
    name: 'hierarchical_code',
  })
  hierarchicalCode: string;

  @Column('character varying', {
    nullable: true,
    name: 'activity_code',
  })
  activityCode: string;

  @Column('integer', {
    nullable: true,
    name: 'level',
  })
  level: number;

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
    () => UserThirdpartiesAuthorizations,
    (scope: UserThirdpartiesAuthorizations) => scope.thirdparty,
  )
  scopes: UserThirdpartiesAuthorizations[];

  @OneToMany(
    () => Thirdpartyappsettings,
    (thirdpartyappsettings: Thirdpartyappsettings) => thirdpartyappsettings.model,
  )
  thirdpartyappsettings: Thirdpartyappsettings[];

  @ManyToOne(
    () => Country,
    (country: Country) => country.thirdparties,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'countryid' })
  country: Country;
}
