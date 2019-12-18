import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './subservice';
import { ProgramAppSettings } from './programappsettings';

@Entity('program', { schema: 'public' })
@Index('program_code_unique_idx', ['code'], { unique: true })
@Index('program_name_unique_idx', ['name'], { unique: true })
export class Program {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    unique: true,
    length: 32,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: false,
    unique: true,
    length: 32,
    name: 'code',
  })
  code: string;

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.program,
  )
  subservices: SubService[];

  @OneToMany(
    () => ProgramAppSettings,
    (programappsettings: ProgramAppSettings) => programappsettings.model,
  )
  programappsettingss: ProgramAppSettings[];
}
