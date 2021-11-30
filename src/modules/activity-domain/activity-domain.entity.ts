import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityDomainAppSettings } from './activity-domain-app-settings/activity-domain-app-settings.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('activitydomain')
@Index('activitydomain_code_unique_idx', ['code'], { unique: true })
export class ActivityDomain {
  @ApiProperty({ nullable: false, type: Number })
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty({ type: String })
  @Column('character varying', {
    name: 'code',
  })
  code: string | null;

  @ApiProperty({ type: String })
  @Column('text', {
    name: 'name',
  })
  name: string;

  @ApiProperty({ type: String })
  @Column('text', {
    name: 'color',
  })
  color: string;

  @ApiProperty({ type: Number })
  @Column('integer', {
    name: 'index',
  })
  index: number;

  @OneToMany(
    () => ActivityDomainAppSettings,
    (activityDomainAppSettings: ActivityDomainAppSettings) => activityDomainAppSettings.activityDomain,
  )
  activityDomainAppSettings: ActivityDomainAppSettings[];
}
