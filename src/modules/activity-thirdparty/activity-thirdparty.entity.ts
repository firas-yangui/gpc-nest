import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { Activity } from '../activity/activity.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activity_thirdparty')
export class ActivityThirdParty {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty()
  @Column('decimal', {
    nullable: true,
    name: 'percent',
  })
  percent: number;
  @ApiProperty()
  @Column('date', {
    nullable: true,
    name: 'start_date',
  })
  startDate: Date;
  @ApiProperty()
  @Column('date', {
    nullable: true,
    name: 'end_date',
  })
  endDate: Date;
  @ApiProperty()
  @ManyToOne(
    () => Activity,
    (activity: Activity) => activity.thirdParty,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'activity_id' })
  activity: Activity | null;
  @ApiProperty()
  @ManyToOne(
    () => Thirdparty,
    (thirdParty: Thirdparty) => thirdParty.activity,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdparty_id' })
  thirdParty: Thirdparty | null;
}
