import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Period } from './period';
import { GpcAppSettings } from './gpcappsettings';

@Entity('periodappsettings', { schema: 'public' })
@Index('unique_period_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class PeriodAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ManyToOne(
    () => Period,
    (period: Period) => period.periodappsettingss,
    {},
  )
  @JoinColumn({ name: 'modelid' })
  model: Period | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.periodappsettingss,
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
