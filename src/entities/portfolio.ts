import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { PortfolioAppSettings } from './portfolioappsettings';
import { SubService } from './subservice';

@Entity('portfolio', { schema: 'public' })
@Index('uniq_english_name', ['englishname'], { unique: true })
@Index('uniq_french_name', ['frenchname'], { unique: true })
export class Portfolio {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: true,
    unique: true,
    name: 'englishname',
  })
  englishname: string | null;

  @Column('text', {
    nullable: true,
    unique: true,
    name: 'frenchname',
  })
  frenchname: string | null;

  @Column('text', {
    nullable: true,
    name: 'currency',
  })
  currency: string | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'rate',
  })
  rate: number | null;

  @OneToMany(
    () => PortfolioAppSettings,
    (portfolioappsettings: PortfolioAppSettings) => portfolioappsettings.model,
    { onDelete: 'CASCADE' },
  )
  portfolioappsettingss: PortfolioAppSettings[];

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.portfolio,
    { onDelete: 'SET NULL' },
  )
  subservices: SubService[];
}
