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
import { irtapplication } from './irtapplication';
import { gpcappsettings } from './gpcappsettings';
import { thirdparty } from './thirdparty';

@Entity('irtapplicationappsettings', { schema: 'public' })
@Index('unique_irtapplication_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class IrtApplicationAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => irtapplication,
    (irtapplication: irtapplication) => irtapplication.irtapplicationappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'modelid' })
  model: irtapplication | null;

  @ManyToOne(
    () => gpcappsettings,
    (gpcappsettings: gpcappsettings) => gpcappsettings.irtapplicationappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: gpcappsettings | null;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.irtapplicationappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: thirdparty | null;

  @Column('text', {
    nullable: false,
    name: 'applicationgroup',
  })
  applicationgroup: string;
}
