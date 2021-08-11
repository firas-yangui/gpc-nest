import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { Activity } from '../activity/activity.entity';

@Entity('activity_thirdparty')
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

  @Column('date', {
    nullable: true,
    name: 'start_date',
  })
  startDate: Date;

  @Column('date', {
    nullable: true,
    name: 'end_date',
  })
  endDate: Date;

  @ManyToOne(
    () => Activity,
    (activity: Activity) => activity.thirdParty,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'activity_id' })
  activity: Activity | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdParty: Thirdparty) => thirdParty.activity,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdparty_id' })
  thirdParty: Thirdparty | null;
}
