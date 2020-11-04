import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from 'typeorm';

@Entity('rawamount')
export class RawAmount {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', {
    name: 'workloadid',
  })
  workloadid: number;

  @Column('integer', {
    name: 'periodid',
  })
  periodid: number;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'mandays',
  })
  mandays: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'keuros',
  })
  keuros: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'klocalcurrency',
  })
  klocalcurrency: number | null;

  @Column('character varying', {
    nullable: true,
    length: 16,
    name: 'status',
  })
  status: string | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'keurossales',
  })
  keurossales: number | null;

  @Column('character varying', {
    length: 256,
    name: 'datasource',
  })
  datasource: string;

  @Column('timestamptz', {
    name: 'created',
  })
  created: Timestamp;
}
