import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './../subservices/subservice.entity';

@Entity('irtapplication')
export class IrtApplication {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'codeirt',
  })
  codeirt: string;

  @Column('text', {
    nullable: false,
    name: 'label',
  })
  label: string;

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.irtApplication,
    { onUpdate: 'CASCADE' },
  )
  subservices: SubService[];
}
