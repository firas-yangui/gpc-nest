import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('migrations', { schema: 'public' })
export class Migrations {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 255,
    name: 'name',
  })
  name: string;

  @Column('timestamp without time zone', {
    nullable: false,
    name: 'run_on',
  })
  run_on: Date;
}
