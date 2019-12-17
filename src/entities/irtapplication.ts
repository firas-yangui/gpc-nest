import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { subservice } from './subservice';
import { IrtApplicationAppSettings } from './irtapplicationappsettings';

@Entity('irtapplication', { schema: 'public' })
export class IrtApplication {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: true,
    name: 'codeirt',
  })
  codeirt: string | null;

  @Column('text', {
    nullable: true,
    name: 'label',
  })
  label: string | null;

  @OneToMany(
    () => subservice,
    (subservice: subservice) => subservice.irtapplication,
    { onUpdate: 'CASCADE' },
  )
  subservices: subservice[];

  @OneToMany(
    () => IrtApplicationAppSettings,
    (irtApplicationAppSettings: IrtApplicationAppSettings) => irtApplicationAppSettings.model,
  )
  irtapplicationappsettingss: IrtApplicationAppSettings[];
}
