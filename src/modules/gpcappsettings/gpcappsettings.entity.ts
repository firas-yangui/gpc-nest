import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User as GpcUser } from './../user/user.entity';
import { Thirdpartyappsettings } from './../thirdparties/thirdpartyappsettings/thirdpartyappsettings.entity';
import { HomeMessageEntity } from './../homeMessage/homeMessage.entity';
import { SubNatureAppSettings } from './../subnatureappsettings/subnatureappsettings.entity';
import { PortfolioAppSettings } from './../portfolioAppSettings/portfolioappsettings.entity';
import { SubTypologyAppSettings } from './../subTypologyAppSettings/subtypologyappsettings.entity';
import { ServiceAppSettings } from '../serviceappsettings/serviceappsettings.entity';
import { ApiProperty } from '@nestjs/swagger';
import { PeriodAppSettings } from '../periods/periodappsettings/periodappsettings.entity';

@Entity('gpcappsettings')
@Index('gpcappsettings_name_key', ['name'], { unique: true })
export class GpcAppSettings {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty()
  @Column('text', {
    nullable: false,
    unique: true,
    name: 'name',
  })
  name: string;

  @ApiProperty()
  @OneToMany(
    () => GpcUser,
    (gpcuser: GpcUser) => gpcuser.gpcAppSettings,
  )
  gpcusers: GpcUser[];

  @ApiProperty()
  @OneToMany(
    () => Thirdpartyappsettings,
    (thirdpartyappsettings: Thirdpartyappsettings) => thirdpartyappsettings.gpcappsettings,
  )
  thirdpartyappsettings: Thirdpartyappsettings[];

  @ApiProperty()
  @OneToMany(
    () => SubNatureAppSettings,
    (subNatureAppSettings: SubNatureAppSettings) => subNatureAppSettings.subnature,
  )
  subnatureappsettings: SubNatureAppSettings[];

  @ApiProperty()
  @OneToMany(
    () => PortfolioAppSettings,
    (portfolioAppSettings: PortfolioAppSettings) => portfolioAppSettings.gpcappsettings,
  )
  portfolioAppSettings: PortfolioAppSettings[];

  @ApiProperty()
  @OneToMany(
    () => ServiceAppSettings,
    (serviceAppSettings: ServiceAppSettings) => serviceAppSettings.gpcAppSettings,
  )
  serviceAppSettings: ServiceAppSettings[];

  @ApiProperty()
  @OneToMany(
    () => SubTypologyAppSettings,
    (subTypologyAppSettings: SubTypologyAppSettings) => subTypologyAppSettings.gpcappsettings,
  )
  subTypologyAppSettings: SubTypologyAppSettings[];

  @ApiProperty()
  @OneToMany(
    () => HomeMessageEntity,
    (homeMessages: HomeMessageEntity) => homeMessages.gpcappsettings,
  )
  homeMessages: HomeMessageEntity[];

  @ApiProperty({ type: () => PeriodAppSettings, isArray: true })
  @OneToMany(
    () => PeriodAppSettings,
    (periodAppSettings: PeriodAppSettings) => periodAppSettings.gpcappsettings,
  )
  periodAppSettings: PeriodAppSettings[];
}
