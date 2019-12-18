import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './subservice';
import { SubTypologyAppSettings } from './subtypologyappsettings';

@Entity('subtypology', { schema: 'public' })
@Index('uniquecode', ['code'], { unique: true })
export class SubTypology {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    unique: true,
    length: 3,
    name: 'code',
  })
  code: string;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('integer', {
    nullable: false,
    default: () => '0',
    name: 'activitytype',
  })
  activitytype: number;

  @Column('text', {
    nullable: true,
    default: () => "'none'",
    name: 'businesstype',
  })
  businesstype: string | null;

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.subtypology,
    { onUpdate: 'CASCADE' },
  )
  subservices: SubService[];

  @OneToMany(
    () => SubTypologyAppSettings,
    (subtypologyappsettings: SubTypologyAppSettings) => subtypologyappsettings.model,
  )
  subtypologyappsettingss: SubTypologyAppSettings[];
}
