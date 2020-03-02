import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Thirdparty } from './../thirdparty.entity';
import { GpcAppSettings } from '../../gpcappsettings/gpcappsettings.entity';

@Entity('thirdpartyappsettings')
@Index('unique_thirdparty_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class Thirdpartyappsettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.thirdpartyappsettings,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: Thirdparty;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.thirdpartyappsettings,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    default: () => "'organization'",
    name: 'type',
  })
  type: string | null;
}
