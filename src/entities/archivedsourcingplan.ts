import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivedsourcingplan', { schema: 'public' })
export class Archivedsourcingplan {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 3,
    name: 'type',
  })
  type: string;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'value',
  })
  value: number | null;

  @Column('integer', {
    nullable: true,
    name: 'childthirdpartyid',
  })
  childthirdpartyid: number | null;

  @Column('integer', {
    nullable: true,
    name: 'parentthirdpartyid',
  })
  parentthirdpartyid: number | null;

  @Column('integer', {
    nullable: true,
    name: 'subnatureid',
  })
  subnatureid: number | null;

  @Column('integer', {
    nullable: true,
    name: 'periodid',
  })
  periodid: number | null;
}
