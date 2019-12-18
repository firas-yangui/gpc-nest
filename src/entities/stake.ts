import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './subservice';
import { Parameter } from './parameter';

@Entity('stake', { schema: 'public' })
export class stake {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: true,
    name: 'englishname',
  })
  englishname: string | null;

  @Column('text', {
    nullable: true,
    name: 'frenchname',
  })
  frenchname: string | null;

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.stake,
    { onDelete: 'SET NULL' },
  )
  subservices: SubService[];

  @OneToMany(
    () => Parameter,
    (parameter: Parameter) => parameter.stake,
    { onDelete: 'SET NULL' },
  )
  parameters: Parameter[];
}
