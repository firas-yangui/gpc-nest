import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Period } from '../period.entity';
import { GpcAppSettings } from '../../gpcappsettings/gpcappsettings.entity';

@Entity('periodappsettings')
@Index('unique_thirdparty_gpcappsettings_couple', ['gpcappsettings', 'period'], { unique: true })
export class PeriodAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Period,
    (period: Period) => period.periodappsettings,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  period: Period;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.thirdpartyappsettings,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @Column('boolean', {
    nullable: false,
    default: () => 'false',
    name: 'iscampaignperiod',
  })
  iscampaignperiod: boolean;

  @Column('character varying', {
    nullable: true,
    length: 128,
    default: () => "'administratorOnly'",
    name: 'status',
  })
  status: string | null;
}
