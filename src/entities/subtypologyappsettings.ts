import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubTypology } from './subtypology';
import { GpcAppSettings } from './gpcappsettings';

@Entity('subtypologyappsettings', { schema: 'public' })
@Index('unique_subtypology_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class SubTypologyAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => SubTypology,
    (subtypology: SubTypology) => subtypology.subtypologyappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: SubTypology | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.subtypologyappsettingss,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'plan',
  })
  plan: string | null;
}
