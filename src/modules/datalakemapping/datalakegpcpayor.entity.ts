import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('datalake_gpc_payor')
export class DatalakeGpcPayor {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'payorname',
  })
  payorname: string;

  @Column('text', {
    nullable: false,
    name: 'gpcpartnername',
  })
  gpcpartnername: string;
}
