import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { IrtApplication } from './irtapplication';
// import { GpcAppSettings } from './gpcappsettings';
import { Thirdparty } from './thirdparty';

@Entity('irtapplicationappsettings', { schema: 'public' })
@Index('unique_irtapplication_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class IrtApplicationAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => IrtApplication,
    (irtapplication: IrtApplication) => irtapplication.irtapplicationappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'modelid' })
  model: IrtApplication | null;

  // @ManyToOne(
  //   () => GpcAppSettings,
  //   (gpcappsettings: GpcAppSettings) => gpcappsettings.irtapplicationappsettingss,
  //   { nullable: false },
  // )
  // @JoinColumn({ name: 'gpcappsettingsid' })
  // gpcappsettings: GpcAppSettings | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.irtapplicationappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @Column('text', {
    nullable: false,
    name: 'applicationgroup',
  })
  applicationgroup: string;
}
