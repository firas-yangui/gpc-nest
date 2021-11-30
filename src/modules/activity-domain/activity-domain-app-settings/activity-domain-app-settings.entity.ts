import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GpcAppSettings } from '../../gpcappsettings/gpcappsettings.entity';
import { ActivityDomain } from '../activity-domain.entity';

@Entity('activitydomainappsettings')
@Index('unique_activitydomain_gpcappsettings_couple', ['gpcappsettings', 'activityDomain'], { unique: true })
export class ActivityDomainAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => ActivityDomain,
    (activityDomaine: ActivityDomain) => activityDomaine.activityDomainAppSettings,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  activityDomain: ActivityDomain | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.activityDomainAppSettings,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;
}
