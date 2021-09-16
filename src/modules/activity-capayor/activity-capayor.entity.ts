import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { CaPayor } from '../capayor/capayor.entity';
import { Activity } from '../activity/activity.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activity_capayor')
export class ActivityCapayor {
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
    (activity: Activity) => activity.capayor,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'activity_id' })
  activity: Activity | null;

  @ApiProperty()
  @ManyToOne(
    () => CaPayor,
    (capayor: CaPayor) => capayor.activity,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'capayor_id' })
  capayor: CaPayor | null;
}
