import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { gpcuser } from './gpcuser';

@Entity('allocationline', { schema: 'public' })
export class AllocationLine {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 50,
    name: 'workloadcode',
  })
  workloadcode: string;

  @Column('character varying', {
    nullable: false,
    length: 8,
    name: 'thirdpartytrigram',
  })
  thirdpartytrigram: string;

  @Column('real', {
    nullable: false,
    precision: 24,
    name: 'weight',
  })
  weight: number;

  @ManyToOne(
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.allocationlines,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'gpcuserid' })
  gpcuser: gpcuser | null;
}
