import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { subnature } from './subnature';
import { Bipexceptionvalue } from './bipexceptionvalue';

@Entity('bipexceptionrule', { schema: 'public' })
export class Bipexceptionrule {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => subnature,
    (subnature: subnature) => subnature.bipexceptionrules,
    {},
  )
  @JoinColumn({ name: 'subnatureid' })
  subnature: subnature | null;

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
    () => Bipexceptionvalue,
    (bipexceptionvalue: Bipexceptionvalue) => bipexceptionvalue.bipexceptionrule,
  )
  bipexceptionvalues: Bipexceptionvalue[];
}
