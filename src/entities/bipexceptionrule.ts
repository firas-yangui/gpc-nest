import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { SubNature } from './subnature';
import { BipExceptionValue } from './bipexceptionvalue';

@Entity('bipexceptionrule', { schema: 'public' })
export class BipExceptionRule {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => SubNature,
    (subnature: SubNature) => subnature.bipexceptionrules,
    {},
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: SubNature | null;

  @Column('character varying', {
    nullable: false,
    length: 7,
    name: 'rulecode',
  })
  rulecode: string;

  @Column('text', {
    nullable: false,
    name: 'columntitle',
  })
  columntitle: string;

  @Column('character varying', {
    nullable: false,
    length: 255,
    name: 'stringpattern',
  })
  stringpattern: string;

  @Column('integer', {
    nullable: true,
    name: 'matchbegin',
  })
  matchbegin: number | null;

  @OneToMany(
    () => BipExceptionValue,
    (bipexceptionvalue: BipExceptionValue) => bipexceptionvalue.bipexceptionrule,
  )
  bipexceptionvalues: BipExceptionValue[];
}
