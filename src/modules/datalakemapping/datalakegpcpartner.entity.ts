import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datalake_gpc_partner')
export class DatalakeGpcPartner {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'datalakename',
  })
  datalakename: string;

  @Column('text', {
    nullable: false,
    name: 'gpcname',
  })
  gpcname: string;
}
