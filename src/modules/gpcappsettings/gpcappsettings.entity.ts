import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User as GpcUser } from './../user/user.entity';
import { Thirdpartyappsettings } from './../thirdparties/thirdpartyappsettings/thirdpartyappsettings.entity';
import { HomeMessageEntity } from './../homeMessage/homeMessage.entity';
import { SubNatureAppSettings } from './../subnatureappsettings/subnatureappsettings.entity';
import { PortfolioAppSettings } from './../portfolioAppSettings/portfolioappsettings.entity';
import { SubTypologyAppSettings } from './../subTypologyAppSettings/subtypologyappsettings.entity';
import { ServiceAppSettings } from '../serviceappsettings/serviceappsettings.entity';

@Entity('gpcappsettings')
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
    (gpcuser: GpcUser) => gpcuser.gpcAppSettings,
  )
  gpcusers: GpcUser[];

  @OneToMany(
    () => Thirdpartyappsettings,
    (thirdpartyappsettings: Thirdpartyappsettings) => thirdpartyappsettings.gpcappsettings,
  )
  thirdpartyappsettings: Thirdpartyappsettings[];

  @OneToMany(
    () => SubNatureAppSettings,
    (subNatureAppSettings: SubNatureAppSettings) => subNatureAppSettings.subnature,
  )
  subnatureappsettings: SubNatureAppSettings[];

  @OneToMany(
    () => PortfolioAppSettings,
    (portfolioAppSettings: PortfolioAppSettings) => portfolioAppSettings.gpcappsettings,
  )
  portfolioAppSettings: PortfolioAppSettings[];

  @OneToMany(
    () => ServiceAppSettings,
    (serviceAppSettings: ServiceAppSettings) => serviceAppSettings.gpcappsettings,
  )
  serviceAppSettings: ServiceAppSettings[];

  @OneToMany(
    () => SubTypologyAppSettings,
    (subTypologyAppSettings: SubTypologyAppSettings) => subTypologyAppSettings.gpcappsettings,
  )
  subTypologyAppSettings: SubTypologyAppSettings[];

  @OneToMany(
    () => HomeMessageEntity,
    (homeMessages: HomeMessageEntity) => homeMessages.gpcappsettings,
  )
  homeMessages: HomeMessageEntity[];
}
