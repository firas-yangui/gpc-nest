import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { TransactionEntity } from '../transactions/transaction.entity';

@Entity('thirdparty', { schema: 'public' })
export class ThirdPartyEntity {
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
}
