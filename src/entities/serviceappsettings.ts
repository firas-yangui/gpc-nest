import { Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { service } from './service';
import { gpcappsettings } from './gpcappsettings';
import { thirdparty } from './thirdparty';
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
    () => gpcappsettings,
    (gpcappsettings: gpcappsettings) => gpcappsettings.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: gpcappsettings | null;

  @ManyToOne(
    () => thirdparty,
    (thirdparty: thirdparty) => thirdparty.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: thirdparty | null;

  @ManyToOne(
    () => ActivityDomain,
    (activitydomain: ActivityDomain) => activitydomain.serviceappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'activitydomainid' })
  activitydomain: ActivityDomain | null;
}
