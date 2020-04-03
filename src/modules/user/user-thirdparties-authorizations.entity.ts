import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { User } from './user.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
@Entity('gpcuserthirdpartiesauthorizations')
export class UserThirdpartiesAuthorizations {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => User,
    (user: User) => user.maxAuthorizations,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'gpcuserid' })
  user: User;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.scopes,
    { nullable: false, onUpdate: 'CASCADE', eager: true },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty;

  @Column()
  maxpermission: string;
}
