import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { Activity } from '../activity/activity.entity';

@Entity('activity-thirdparty')
export class ActivityThirdParty {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('decimal', {
    nullable: true,
    name: 'percent',
  })
  percent: number;

  @ManyToOne(
    () => Activity,
    (activity: Activity) => activity.thirdParty,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'activity' })
  activity: Activity | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdParty: Thirdparty) => thirdParty.activity,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'periodid' })
  thirdParty: Thirdparty | null;
}
