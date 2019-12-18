import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('archivedsubsidiaryallocation', { schema: 'public' })
export class ArchivedSubsidiaryAllocation {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', {
    nullable: true,
    name: 'thirdpartyid',
  })
  thirdpartyid: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'weight',
  })
  weight: number | null;

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
}
