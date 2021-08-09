import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';

@Entity({ name: 'mtr_activity' })
export class Activity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: true,
    name: 'project_code',
  })
  projectCode: string;

  @Column('text', {
    nullable: true,
    name: 'schedule_name',
  })
  scheduleName: string;

  @Column('text', {
    nullable: true,
    name: 'axe',
  })
  axe: string;

  @Column('text', {
    nullable: true,
    name: 'plan',
  })
  plan: string;

  @Column('text', {
    nullable: true,
    name: 'activity_type',
  })
  activityType: string;

  @Column('text', {
    nullable: true,
    name: 'payor',
  })
  payor: string;

  @Column('text', {
    nullable: true,
    name: 'label_payor',
  })
  labelPayor: string;

  @Column('text', {
    nullable: true,
    name: 'application',
  })
  application: string;

  @Column('text', {
    nullable: true,
    name: 'application_label',
  })
  applicationLabel: string;

  @Column('text', {
    nullable: true,
    name: 'immob',
  })
  immob: string;

  @Column('text', {
    nullable: true,
    name: 'activity_code',
  })
  activityCode: string;

  @OneToMany(
    () => Thirdparty,
    (thirdParty: Thirdparty) => thirdParty.activity,
    { onDelete: 'CASCADE' },
  )
  thirdParty: Thirdparty[];
}
