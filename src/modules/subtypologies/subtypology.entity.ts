import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubService } from './../subservices/subservice.entity';

@Entity('subtypology')
export class Subtypology {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 3,
    name: 'code',
  })
  code: string | null;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('integer', {
    nullable: false,
    name: 'activitytype',
  })
  activitytype: number;

  @Column('text', {
    nullable: true,
    name: 'businesstype',
  })
  businesstype: string;

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.subtypology,
  )
  subservices: SubService[];
}
