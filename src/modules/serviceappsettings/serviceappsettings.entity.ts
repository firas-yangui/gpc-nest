import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Service } from './../services/services.entity';
import { GpcAppSettings } from './../gpcappsettings/gpcappsettings.entity';
import { Thirdparty } from './../thirdparties/thirdparty.entity';

@Entity('serviceappsettings')
export class ServiceAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Service,
    (service: Service) => service.serviceAppSettings,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'modelid' })
  model: Service | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.serviceAppSettings,
    { nullable: false },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcAppSettings: GpcAppSettings | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.serviceAppSettings,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;
}
