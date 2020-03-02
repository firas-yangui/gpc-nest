import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './portfolio';
// import { GpcAppSettings } from './gpcappsettings';
import { Thirdparty } from './thirdparty';

@Entity('portfolioappsettings', { schema: 'public' })
@Index('unique_portfolio_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class PortfolioAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  // @ManyToOne(
  //   () => portfolio,
  //   (portfolio: portfolio) => portfolio.portfolioappsettingss,
  //   { nullable: false, onDelete: 'CASCADE' },
  // )
  // @JoinColumn({ name: 'modelid' })
  // model: portfolio | null;

  // @ManyToOne(
  //   () => GpcAppSettings,
  //   (gpcappsettings: GpcAppSettings) => gpcappsettings.portfolioappsettingss,
  //   { nullable: false },
  // )
  // @JoinColumn({ name: 'gpcappsettingsid' })
  // gpcappsettings: GpcAppSettings | null;

  @Column('text', {
    nullable: true,
    name: 'manager',
  })
  manager: string | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.portfolioappsettingss,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;

  @Column('text', {
    nullable: true,
    name: 'strategicbusinesspartner',
  })
  strategicbusinesspartner: string | null;
}
