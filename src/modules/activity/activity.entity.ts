import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';

@Entity({ name: 'mtr_activity' })
export class Activity {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'project_code',
  })
  projectCode: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'schedule_name',
  })
  scheduleName: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'axe',
  })
  axe: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'plan',
  })
  plan: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'activity_type',
  })
  activityType: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'payor',
  })
  payor: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'label_payor',
  })
  labelPayor: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'application',
  })
  application: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'application_label',
  })
  applicationLabel: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'immob',
  })
  immob: string;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'activity_code',
  })
  activityCode: string;

  @ApiProperty()
  @OneToMany(
    () => Thirdparty,
    (thirdParty: Thirdparty) => thirdParty.activity,
    { onDelete: 'CASCADE' },
  )
  thirdParty: Thirdparty[];
}
