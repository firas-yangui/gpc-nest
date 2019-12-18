import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('initialisationtemporaryentity', { schema: 'public' })
export class InitialisationTemporaryEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: true,
    length: 128,
    name: 'modelname',
  })
  modelname: string | null;

  @Column('json', {
    nullable: true,
    name: 'csvobject',
  })
  csvobject: object | null;
}
