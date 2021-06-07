import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { AmountStat } from '../amountstats/amountstat.entity';
import { ServiceAppSettings } from '../serviceappsettings/serviceappsettings.entity';
import { SubService } from './../subservices/subservice.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity('service')
@Index('service_code_unique_idx', ['code'], { unique: true })
export class Service {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty()
  @Column('text', {
    nullable: false,
    name: 'code',
  })
  code: string;

  @ApiProperty()
  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @ApiProperty()
  @Column('date', {
    nullable: true,
    name: 'lastupdatedate',
  })
  lastupdatedate: string | null;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    name: 'description',
  })
  description: string | null;

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.service,
    { onUpdate: 'CASCADE' },
  )
  subservices: SubService[];

  @OneToMany(
    () => ServiceAppSettings,
    (serviceappsettings: ServiceAppSettings) => serviceappsettings.model,
  )
  serviceAppSettings: ServiceAppSettings[];

  @OneToMany(
    () => AmountStat,
    (amountStats: AmountStat) => amountStats.service,
  )
  amountStats: AmountStat[];
}
