import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BiplineErrors } from './bipline_errors';

@Entity('import_raw_bipline_file', { schema: 'public' })
export class ImportRawBiplineFile {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 150,
    name: 'filename',
  })
  filename: string;

  @Column('timestamp without time zone', {
    nullable: false,
    name: 'date',
  })
  date: Date;

  @OneToMany(
    () => BiplineErrors,
    (biplineErrors: BiplineErrors) => biplineErrors.idFile,
  )
  biplineErrors: BiplineErrors[];
}
