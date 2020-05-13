import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Portfolio } from './../portfolio/portfolio.entity';
import { GpcAppSettings } from './../gpcappsettings/gpcappsettings.entity';
import { Thirdparty } from './../thirdparties/thirdparty.entity';

@Entity('portfolioappsettings')
@Index('unique_portfolio_gpcappsettings_couple', ['gpcappsettings', 'model'], { unique: true })
export class PortfolioAppSettings {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: true,
    name: 'manager',
  })
  manager: string | null;

  @Column('text', {
    nullable: true,
    name: 'strategicbusinesspartner',
  })
  strategicbusinesspartner: string | null;

  @ManyToOne(
    () => Portfolio,
    (portfolio: Portfolio) => portfolio.portfolioappsettingss,
    { nullable: false, onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'modelid' })
  model: Portfolio | null;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.portfolioAppSettings,
    { nullable: false },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.portfolioappsettings,
    { nullable: false },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdparty: Thirdparty | null;
}
