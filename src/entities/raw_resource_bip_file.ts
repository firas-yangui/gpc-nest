import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('raw_resource_bip_file', { schema: 'public' })
export class RawResourceBipFile {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'projectname',
  })
  projectname: string | null;

  @Column('character varying', {
    nullable: true,
    length: 5,
    name: 'linecode',
  })
  linecode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'linename',
  })
  linename: string | null;

  @Column('character varying', {
    nullable: true,
    length: 3,
    name: 'steptype',
  })
  steptype: string | null;

  @Column('integer', {
    nullable: true,
    name: 'stepnumber',
  })
  stepnumber: number | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'stepname',
  })
  stepname: string | null;

  @Column('integer', {
    nullable: true,
    name: 'tasknumber',
  })
  tasknumber: number | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'taskname',
  })
  taskname: string | null;

  @Column('integer', {
    nullable: true,
    name: 'subtasknumber',
  })
  subtasknumber: number | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'subtasktype',
  })
  subtasktype: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'subtaskname',
  })
  subtaskname: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'dpgimputation',
  })
  dpgimputation: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'dirimputation',
  })
  dirimputation: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'resourcename',
  })
  resourcename: string | null;

  @Column('integer', {
    nullable: true,
    name: 'resourceid',
  })
  resourceid: number | null;

  @Column('character varying', {
    nullable: true,
    length: 8,
    name: 'resourcedpg',
  })
  resourcedpg: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'company',
  })
  company: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'business',
  })
  business: string | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'totalactualamount',
  })
  totalactualamount: number | null;

  @Column('character varying', {
    nullable: true,
    length: 5,
    name: 'resourcetype',
  })
  resourcetype: string | null;

  @Column('character varying', {
    nullable: true,
    length: 5,
    name: 'prestationcode',
  })
  prestationcode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'fiprofile',
  })
  fiprofile: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'stachestatus',
  })
  stachestatus: string | null;

  @Column('character varying', {
    nullable: true,
    length: 8,
    name: 'linedpg',
  })
  linedpg: string | null;

  @Column('character varying', {
    nullable: true,
    length: 256,
    name: 'steptypename',
  })
  steptypename: string | null;

  @Column('character varying', {
    nullable: true,
    length: 10,
    name: 'calculatedthirdpartyradical',
  })
  calculatedthirdpartyradical: string | null;

  @Column('character varying', {
    nullable: true,
    length: 2,
    name: 'calculatedsubnaturecode',
  })
  calculatedsubnaturecode: string | null;

  @Column('character varying', {
    nullable: true,
    length: 20,
    name: 'calculatedcode',
  })
  calculatedcode: string | null;
}
