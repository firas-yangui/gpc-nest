import { Column, Entity, Index, PrimaryGeneratedColumn } from 'typeorm';

@Entity('import_raw_bipline_data', { schema: 'public' })
@Index('import_raw_bipline_data_code_id_file_key', ['code', 'id_file'], { unique: true })
export class ImportRawBiplineData {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('bigint', {
    nullable: false,
    unique: true,
    name: 'id_file',
  })
  id_file: string;

  @Column('character varying', {
    nullable: false,
    unique: true,
    length: 50,
    name: 'code',
  })
  code: string;

  @Column('character varying', {
    nullable: false,
    length: 32,
    name: 'label',
  })
  label: string;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'notified',
  })
  notified: number | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'arbitrated',
  })
  arbitrated: number | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'estimated',
  })
  estimated: number | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'realised',
  })
  realised: number | null;

  @Column('text', {
    nullable: true,
    name: 'personinchargecode',
  })
  personinchargecode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 13,
    name: 'calculatedthirdpartyradical',
  })
  calculatedthirdpartyradical: string | null;

  @Column('bigint', {
    nullable: true,
    name: 'calculatedthirdpartyid',
  })
  calculatedthirdpartyid: string | null;

  @Column('character varying', {
    nullable: true,
    length: 8,
    name: 'calculatedsubnaturecode',
  })
  calculatedsubnaturecode: string | null;

  @Column('bigint', {
    nullable: true,
    name: 'calculatedsubnatureid',
  })
  calculatedsubnatureid: string | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'committed',
  })
  committed: number | null;

  @Column('integer', {
    nullable: false,
    name: 'gpcuserid',
  })
  gpcuserid: number;

  @Column('text', {
    nullable: true,
    name: 'subservicecode',
  })
  subservicecode: string | null;

  @Column('text', {
    nullable: true,
    name: 'subservicename',
  })
  subservicename: string | null;

  @Column('character varying', {
    nullable: true,
    length: 3,
    name: 'subservicesubtypologycode',
  })
  subservicesubtypologycode: string | null;

  @Column('text', {
    nullable: true,
    name: 'subserviceirtapplicationcodeirt',
  })
  subserviceirtapplicationcodeirt: string | null;

  @Column('boolean', {
    nullable: true,
    name: 'subserviceisinvested',
  })
  subserviceisinvested: boolean | null;

  @Column('character varying', {
    nullable: true,
    length: 32,
    name: 'subserviceprogramcode',
  })
  subserviceprogramcode: string | null;

  @Column('text', {
    nullable: true,
    name: 'subserviceservicecode',
  })
  subserviceservicecode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 50,
    name: 'targetcode',
  })
  targetcode: string | null;

  @Column('text', {
    nullable: true,
    name: 'subservicecacode',
  })
  subservicecacode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 32,
    name: 'allocationthirdpartytrigram',
  })
  allocationthirdpartytrigram: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'filename',
  })
  filename: string | null;

  @Column('integer', {
    nullable: true,
    name: 'subserviceid',
  })
  subserviceid: number | null;

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

  @Column('integer', {
    nullable: false,
    name: 'id_organisation',
  })
  id_organisation: number;

  @Column('character varying', {
    nullable: true,
    length: 25,
    name: 'bip_code',
  })
  bip_code: string | null;

  @Column('character varying', {
    nullable: true,
    length: 20,
    name: 'subnature_code',
  })
  subnature_code: string | null;

  @Column('text', {
    nullable: true,
    name: 'dpg',
  })
  dpg: string | null;

  @Column('character varying', {
    nullable: true,
    length: 356,
    name: 'bipline_object',
  })
  bipline_object: string | null;

  @Column('character varying', {
    nullable: true,
    length: 356,
    name: 'responsable_code_bip',
  })
  responsable_code_bip: string | null;

  @Column('character varying', {
    nullable: true,
    length: 356,
    name: 'responsable_name',
  })
  responsable_name: string | null;
}
