import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { service } from './service';
import { GpcAppSettings } from './gpcappsettings';
import { Thirdparty } from './thirdparty';
import { ActivityDomain } from './activitydomain';

@Entity('serviceappsettings', { schema: 'public' })
@Index('unique_service_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class ServiceAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => service,
    (service: service) => service.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'modelid' })
  model: service | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @ManyToOne(
    () => ActivityDomain,
    (activitydomain: ActivityDomain) => activitydomain.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'activitydomainid' })
  activitydomain: ActivityDomain | null;
}
