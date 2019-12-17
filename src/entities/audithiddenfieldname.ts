import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('audithiddenfieldname', { schema: 'public' })
export class Audithiddenfieldname {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: true,
    length: 50,
    name: 'fieldname',
  })
  fieldname: string | null;
}
