import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './../subservices/subservice.entity';

@Entity('service')
@Index('service_code_unique_idx', ['code'], { unique: true })
export class Service {
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

  @Column('date', {
    nullable: true,
    name: 'lastupdatedate',
  })
  lastupdatedate: string | null;

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

  // @OneToMany(
  //   () => ServiceAppSettings,
  //   (serviceappsettings: ServiceAppSettings) => serviceappsettings.model,
  // )
  // serviceappsettingss: ServiceAppSettings[];
}