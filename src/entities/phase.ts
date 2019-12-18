import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectReporting } from './projectreporting';
import { Parameter } from './parameter';
import { SubService } from './subservice';
import { PhaseAppSettings } from './phaseappsettings';

@Entity('phase', { schema: 'public' })
export class Phase {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: true,
    name: 'englishname',
  })
  englishname: string | null;

  @Column('text', {
    nullable: true,
    name: 'frenchname',
  })
  frenchname: string | null;

  @OneToMany(
    () => ProjectReporting,
    (projectreporting: ProjectReporting) => projectreporting.phase,
  )
  projectreportings: ProjectReporting[];

  @OneToMany(
    () => Parameter,
    (parameter: Parameter) => parameter.phase,
  )
  parameters: Parameter[];

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.phase,
  )
  subservices: SubService[];

  @OneToMany(
    () => PhaseAppSettings,
    (phaseappsettings: PhaseAppSettings) => phaseappsettings.model,
  )
  phaseappsettingss: PhaseAppSettings[];
}
