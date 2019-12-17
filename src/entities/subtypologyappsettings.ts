import {
  BaseEntity,
  Column,
  Entity,
  Index,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  OneToOne,
  PrimaryColumn,
  PrimaryGeneratedColumn,
  RelationId,
} from 'typeorm';
import { subtypology } from './subtypology';
import { gpcappsettings } from './gpcappsettings';

@Entity('subtypologyappsettings', { schema: 'public' })
@Index('unique_subtypology_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class subtypologyappsettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => subtypology,
    (subtypology: subtypology) => subtypology.subtypologyappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: subtypology | null;

  @ManyToOne(
    () => gpcappsettings,
    (gpcappsettings: gpcappsettings) => gpcappsettings.subtypologyappsettingss,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: gpcappsettings | null;

  @Column('character varying', {
    nullable: true,
    length: 255,
    name: 'plan',
  })
  plan: string | null;
}
