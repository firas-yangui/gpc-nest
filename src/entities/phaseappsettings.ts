import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Phase } from './phase';
import { GpcAppSettings } from '../modules/gpcappsettings/gpcappsettings.entity';

@Entity('phaseappsettings', { schema: 'public' })
@Index('unique_phase_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class PhaseAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Phase,
    (phase: Phase) => phase.phaseappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: Phase | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.phaseappsettingss,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @Column('integer', {
    nullable: true,
    name: 'phaseorder',
  })
  phaseorder: number | null;
}
