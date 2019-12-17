import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Activitydomain } from './activitydomain';
import { gpcappsettings } from './gpcappsettings';

@Entity('activitydomainappsettings', { schema: 'public' })
@Index('unique_activitydomain_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class Activitydomainappsettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Activitydomain,
    (activitydomain: Activitydomain) => activitydomain.activitydomainappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: Activitydomain | null;

  @ManyToOne(
    () => gpcappsettings,
    (gpcappsettings: gpcappsettings) => gpcappsettings.activitydomainappsettingss,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: gpcappsettings | null;
}
