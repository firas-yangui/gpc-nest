import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { program } from './program';
import { GpcAppSettings } from './gpcappsettings';

@Entity('programappsettings', { schema: 'public' })
export class ProgramAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => program,
    (program: program) => program.programappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: program | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.programappsettingss,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;
}
