import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivedsubserviceperiod', { schema: 'public' })
export class ArchivedSubServicePeriod {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('boolean', {
    nullable: true,
    default: () => 'false',
    name: 'isinvested',
  })
  isinvested: boolean | null;

  @Column('integer', {
    nullable: false,
    name: 'periodid',
  })
  periodid: number;

  @Column('integer', {
    nullable: false,
    name: 'subserviceid',
  })
  subserviceid: number;
}
