import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { SubNature } from './../subnature/subnature.entity';
import { GpcAppSettings } from './../gpcappsettings/gpcappsettings.entity';

@Entity('subnatureappsettings')
@Index('unique_subnature_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class SubNatureAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.subnatureappsettings,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: SubNature | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.subnatureappsettings,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'dfincode',
  })
  dfincode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'nrgcode',
  })
  nrgcode: string | null;
}
