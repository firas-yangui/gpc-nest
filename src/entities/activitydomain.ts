import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { activitydomainappsettings } from './activitydomainappsettings';
import { serviceappsettings } from './serviceappsettings';

@Entity('activitydomain', { schema: 'public' })
@Index('activitydomain_code_unique_idx', ['code'], { unique: true })
@Index('activity_domain_index_idx', ['index'])
export class ActivityDomain {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'code',
  })
  code: string;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: true,
    length: 16,
    name: 'color',
  })
  color: string | null;

  @Column('integer', {
    nullable: true,
    name: 'index',
  })
  index: number | null;

  @Column('character varying', {
    nullable: true,
    length: 128,
    name: 'funcdomain',
  })
  funcdomain: string | null;

  @OneToMany(
    () => activitydomainappsettings,
    (activitydomainappsettings: activitydomainappsettings) => activitydomainappsettings.model,
  )
  activitydomainappsettingss: activitydomainappsettings[];

  @OneToMany(
    () => serviceappsettings,
    (serviceappsettings: serviceappsettings) => serviceappsettings.activitydomain,
  )
  serviceappsettingss: serviceappsettings[];
}
