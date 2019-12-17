import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { gpcuser } from './gpcuser';
import { irtapplicationappsettings } from './irtapplicationappsettings';
import { portfolioappsettings } from './portfolioappsettings';
import { subtypologyappsettings } from './subtypologyappsettings';
import { homemessage } from './homemessage';
import { activitydomainappsettings } from './activitydomainappsettings';
import { thirdpartyappsettings } from './thirdpartyappsettings';
import { phaseappsettings } from './phaseappsettings';
import { programappsettings } from './programappsettings';
import { subnatureappsettings } from './subnatureappsettings';
import { serviceappsettings } from './serviceappsettings';
import { periodappsettings } from './periodappsettings';

@Entity('Gpcappsettings', { schema: 'public' })
@Index('gpcappsettings_name_key', ['name'], { unique: true })
export class Gpcappsettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    unique: true,
    name: 'name',
  })
  name: string;

  @OneToMany(
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.gpcappsettings,
  )
  gpcusers: gpcuser[];

  @OneToMany(
    () => irtapplicationappsettings,
    (irtapplicationappsettings: irtapplicationappsettings) => irtapplicationappsettings.gpcappsettings,
  )
  irtapplicationappsettingss: irtapplicationappsettings[];

  @OneToMany(
    () => portfolioappsettings,
    (portfolioappsettings: portfolioappsettings) => portfolioappsettings.gpcappsettings,
  )
  portfolioappsettingss: portfolioappsettings[];

  @OneToMany(
    () => subtypologyappsettings,
    (subtypologyappsettings: subtypologyappsettings) => subtypologyappsettings.gpcappsettings,
  )
  subtypologyappsettingss: subtypologyappsettings[];

  @OneToMany(
    () => homemessage,
    (homemessage: homemessage) => homemessage.gpcappsettings,
  )
  homemessages: homemessage[];

  @OneToMany(
    () => activitydomainappsettings,
    (activitydomainappsettings: activitydomainappsettings) => activitydomainappsettings.gpcappsettings,
  )
  activitydomainappsettingss: activitydomainappsettings[];

  @OneToMany(
    () => thirdpartyappsettings,
    (thirdpartyappsettings: thirdpartyappsettings) => thirdpartyappsettings.gpcappsettings,
  )
  thirdpartyappsettingss: thirdpartyappsettings[];

  @OneToMany(
    () => phaseappsettings,
    (phaseappsettings: phaseappsettings) => phaseappsettings.gpcappsettings,
  )
  phaseappsettingss: phaseappsettings[];

  @OneToMany(
    () => programappsettings,
    (programappsettings: programappsettings) => programappsettings.gpcappsettings,
  )
  programappsettingss: programappsettings[];

  @OneToMany(
    () => subnatureappsettings,
    (subnatureappsettings: subnatureappsettings) => subnatureappsettings.gpcappsettings,
  )
  subnatureappsettingss: subnatureappsettings[];

  @OneToMany(
    () => serviceappsettings,
    (serviceappsettings: serviceappsettings) => serviceappsettings.gpcappsettings,
  )
  serviceappsettingss: serviceappsettings[];

  @OneToMany(
    () => periodappsettings,
    (periodappsettings: periodappsettings) => periodappsettings.gpcappsettings,
  )
  periodappsettingss: periodappsettings[];
}
