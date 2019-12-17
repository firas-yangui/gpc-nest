import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Bipexceptionrule } from './bipexceptionrule';

@Entity('bipexceptionvalue', { schema: 'public' })
@Index('bipexceptionvalue_idx', ['bipexceptionrule', 'fileoccurence'], { unique: true })
export class Bipexceptionvalue {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Bipexceptionrule,
    (bipexceptionrule: Bipexceptionrule) => bipexceptionrule.bipexceptionvalues,
    {},
  )
  @JoinColumn({ name: 'bipexceptionruleid' })
  bipexceptionrule: Bipexceptionrule | null;

  @Column('character varying', {
    nullable: false,
    length: 255,
    name: 'fileoccurence',
  })
  fileoccurence: string;
}
