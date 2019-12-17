import { Column, Entity, JoinColumn, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Import_raw_bipline_file } from './import_raw_bipline_file';

@Entity('bipline_errors', { schema: 'public' })
export class BiplineErrors {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => import_raw_bipline_file,
    (import_raw_bipline_file: import_raw_bipline_file) => import_raw_bipline_file.biplineErrorss,
    { nullable: false },
  )
  @JoinColumn({ name: 'id_file' })
  idFile: import_raw_bipline_file | null;

  @Column('bigint', {
    nullable: true,
    name: 'id_raw_bip_line',
  })
  id_raw_bip_line: string | null;

  @Column('character varying', {
    nullable: true,
    length: 50,
    name: 'code',
  })
  code: string | null;

  @Column('character varying', {
    nullable: false,
    length: 50,
    name: 'bip_code',
  })
  bip_code: string;

  @Column('character varying', {
    nullable: true,
    length: 50,
    name: 'subnature_code',
  })
  subnature_code: string | null;

  @Column('character varying', {
    nullable: false,
    length: 100,
    name: 'label',
  })
  label: string;

  @Column('integer', {
    nullable: true,
    name: 'id_organisation',
  })
  id_organisation: number | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'total',
  })
  total: number | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'total_htr',
  })
  total_htr: number | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'total_complet',
  })
  total_complet: number | null;

  @Column('character varying', {
    nullable: false,
    length: 120,
    name: 'error_message_fr',
  })
  error_message_fr: string;

  @Column('character varying', {
    nullable: false,
    length: 120,
    name: 'error_message_en',
  })
  error_message_en: string;

  @Column('text', {
    nullable: true,
    name: 'dpg',
  })
  dpg: string | null;

  @Column('boolean', {
    nullable: true,
    name: 'is_inserted',
  })
  is_inserted: boolean | null;
}
