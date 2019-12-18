import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { BipExceptionRule } from './bipexceptionrule';

@Entity('bipexceptionvalue', { schema: 'public' })
@Index('bipexceptionvalue_idx', ['bipexceptionrule', 'fileoccurence'], { unique: true })
export class BipExceptionValue {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => BipExceptionRule,
    (bipexceptionrule: BipExceptionRule) => bipexceptionrule.bipexceptionvalues,
    {},
  )
  @JoinColumn({ name: 'bipexceptionruleid' })
  bipexceptionrule: BipExceptionRule | null;

  @Column('character varying', {
    nullable: false,
    length: 255,
    name: 'fileoccurence',
  })
  fileoccurence: string;
}
