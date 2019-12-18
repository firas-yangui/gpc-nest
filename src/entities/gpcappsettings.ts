import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { GpcUser } from './gpcuser';
import { IrtApplicationAppSettings } from './irtapplicationappsettings';
import { PortfolioAppSettings } from './portfolioappsettings';
import { SubTypologyAppSettings } from './subtypologyappsettings';
import { HomeMessage } from './homemessage';
import { ActivityDomainAppSettings } from './activitydomainappsettings';
import { ThirdPartyAppSettings } from './thirdpartyappsettings';
import { PhaseAppSettings } from './phaseappsettings';
import { ProgramAppSettings } from './programappsettings';
import { SubNatureAppSettings } from './subnatureappsettings';
import { ServiceAppSettings } from './serviceappsettings';
import { PeriodAppSettings } from './periodappsettings';

@Entity('Gpcappsettings', { schema: 'public' })
@Index('gpcappsettings_name_key', ['name'], { unique: true })
export class GpcAppSettings {
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
    () => GpcUser,
    (gpcuser: GpcUser) => gpcuser.gpcappsettings,
  )
  gpcusers: GpcUser[];

  @OneToMany(
    () => IrtApplicationAppSettings,
    (irtapplicationappsettings: IrtApplicationAppSettings) => irtapplicationappsettings.gpcappsettings,
  )
  irtapplicationappsettingss: IrtApplicationAppSettings[];

  @OneToMany(
    () => PortfolioAppSettings,
    (portfolioappsettings: PortfolioAppSettings) => portfolioappsettings.gpcappsettings,
  )
  portfolioappsettingss: PortfolioAppSettings[];

  @OneToMany(
    () => SubTypologyAppSettings,
    (subtypologyappsettings: SubTypologyAppSettings) => subtypologyappsettings.gpcappsettings,
  )
  subtypologyappsettingss: SubTypologyAppSettings[];

  @OneToMany(
    () => HomeMessage,
    (homemessage: HomeMessage) => homemessage.gpcappsettings,
  )
  homemessages: HomeMessage[];

  @OneToMany(
    () => ActivityDomainAppSettings,
    (activitydomainappsettings: ActivityDomainAppSettings) => activitydomainappsettings.gpcappsettings,
  )
  activitydomainappsettingss: ActivityDomainAppSettings[];

  @OneToMany(
    () => ThirdPartyAppSettings,
    (thirdpartyappsettings: ThirdPartyAppSettings) => thirdpartyappsettings.gpcappsettings,
  )
  thirdpartyappsettingss: ThirdPartyAppSettings[];

  @OneToMany(
    () => PhaseAppSettings,
    (phaseappsettings: PhaseAppSettings) => phaseappsettings.gpcappsettings,
  )
  phaseappsettingss: PhaseAppSettings[];

  @OneToMany(
    () => ProgramAppSettings,
    (programappsettings: ProgramAppSettings) => programappsettings.gpcappsettings,
  )
  programappsettingss: ProgramAppSettings[];

  @OneToMany(
    () => SubNatureAppSettings,
    (subnatureappsettings: SubNatureAppSettings) => subnatureappsettings.gpcappsettings,
  )
  subnatureappsettingss: SubNatureAppSettings[];

  @OneToMany(
    () => ServiceAppSettings,
    (serviceappsettings: ServiceAppSettings) => serviceappsettings.gpcappsettings,
  )
  serviceappsettingss: ServiceAppSettings[];

  @OneToMany(
    () => PeriodAppSettings,
    (periodappsettings: PeriodAppSettings) => periodappsettings.gpcappsettings,
  )
  periodappsettingss: PeriodAppSettings[];
}
