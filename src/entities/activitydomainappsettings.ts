import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ActivityDomain } from './activitydomain';
import { GpcAppSettings } from './gpcappsettings';

@Entity('activitydomainappsettings', { schema: 'public' })
@Index('unique_activitydomain_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class ActivityDomainAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => ActivityDomain,
    (activitydomain: ActivityDomain) => activitydomain.activitydomainappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: ActivityDomain | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.activitydomainappsettingss,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: gpcappsettings | null;
}
