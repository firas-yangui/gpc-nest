import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Subtypology } from '../subtypologies/subtypology.entity';
import { GpcAppSettings } from '../gpcappsettings/gpcappsettings.entity';

@Entity('subtypologyappsettings')
@Index('unique_subtypology_gpcappsettings_couple', ['gpcappsettings', 'subTypology'], { unique: true })
export class SubTypologyAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'plan',
  })
  plan: string | null;

  @ManyToOne(
    () => Subtypology,
    (subtypology: Subtypology) => subtypology.subTypologyAppSettings,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  subTypology: Subtypology | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.subTypologyAppSettings,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;
}
