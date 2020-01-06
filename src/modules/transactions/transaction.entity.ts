import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubServiceEntity } from '../subservices/subservice.entity';
import { ThirdPartyEntity } from '../thirdparties/thirdParty.entity';
import { UserEntity } from '../users/user.entity';

@Entity('transaction', { schema: 'public' })
export class TransactionEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => SubServiceEntity,
    (subService: SubServiceEntity) => subService.transactions,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'subservice_id' })
  subService: SubServiceEntity;

  @ManyToOne(
    () => ThirdPartyEntity,
    (targetThirdParty: ThirdPartyEntity) => targetThirdParty.transactions,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'target_thirdparty_id' })
  targetThirdParty: ThirdPartyEntity;

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.sentTransactions,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_sender' })
  sender: UserEntity;

  @ManyToOne(
    () => UserEntity,
    (user: UserEntity) => user.receivedTransactions,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'user_receiver' })
  receiver: UserEntity;

  @Column('text', { nullable: false, name: 'status' })
  status: string;

  @Column('text', { nullable: false, name: 'unit' })
  unit: string;

  @Column('timestamp', { nullable: false, name: 'created_date' })
  createdDate: Date;

  @Column('timestamp', { nullable: false, name: 'received_date' })
  receivedDate: Date;

  @Column('timestamp', { nullable: false, name: 'rejected_date' })
  rejectedDate: Date;
}
