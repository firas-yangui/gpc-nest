import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivedamount', { schema: 'public' })
export class Archivedamount {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', {
    nullable: false,
    name: 'workloadid',
  })
  workloadid: number;

  @Column('integer', {
    nullable: false,
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
}
