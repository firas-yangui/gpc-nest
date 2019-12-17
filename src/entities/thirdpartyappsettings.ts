import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { thirdparty } from './thirdparty';
import { GpcAppSettings } from './gpcappsettings';

@Entity('thirdpartyappsettings', { schema: 'public' })
@Index('unique_thirdparty_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class ThirdpartyAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.thirdpartyappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: thirdparty | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.thirdpartyappsettingss,
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
