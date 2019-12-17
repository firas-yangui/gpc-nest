import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { gpcuser } from './gpcuser';

@Entity('Bipline', { schema: 'public' })
export class Bipline {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
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

  @Column('character varying', {
    nullable: true,
    length: 8,
    name: 'calculatedsubnaturecode',
  })
  calculatedsubnaturecode: string | null;

  @Column('double precision', {
    nullable: true,
    precision: 53,
    name: 'committed',
  })
  committed: number | null;

  @ManyToOne(
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.biplines,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'gpcuserid' })
  gpcuser: gpcuser | null;

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

  @Column('bigint', {
    nullable: true,
    name: 'index',
  })
  index: string | null;
}
