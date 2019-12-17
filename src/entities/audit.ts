import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { gpcuser } from './gpcuser';

@Entity('audit', { schema: 'public' })
export class Audit {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.audits,
    { onDelete: 'SET NULL' },
  )
  @JoinColumn({ name: 'userid' })
  user: gpcuser | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'date',
  })
  date: Date | null;

  @Column('character varying', {
    nullable: true,
    length: 128,
    name: 'modelname',
  })
  modelname: string | null;

  @Column('character varying', {
    nullable: true,
    length: 128,
    name: 'methodname',
  })
  methodname: string | null;

  @Column('json', {
    nullable: true,
    name: 'oldobject',
  })
  oldobject: object | null;

  @Column('json', {
    nullable: true,
    name: 'newobject',
  })
  newobject: object | null;
}
