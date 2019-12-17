import { Column, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Country } from './country';
import { sourcingplan } from './sourcingplan';
import { GpcUser } from './gpcuser';
import { PreValidationPrice } from './pre_validation_price';
import { Transaction } from './transaction';
import { IrtApplicationAppSettings } from './irtapplicationappsettings';
import { Workload } from './workload';
import { SubSidiaryAllocation } from './subsidiaryallocation';
import { MixSourcingStandard } from './mixsourcingstandard';
import { PortfolioAppSettings } from './portfolioappsettings';
import { ThirdpartyAppSettings } from './thirdpartyappsettings';
import { ServiceAppSettings } from './serviceappsettings';
import { Price } from './price';
import { SubService } from './subservice';

@Entity('thirdparty', { schema: 'public' })
@Index('thirdparty_radical_unique_idx', ['radical'], { unique: true })
@Index('thirdparty_trigram_unique_idx', ['trigram'], { unique: true })
export class Thirdparty {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'radical',
  })
  radical: string;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('character varying', {
    nullable: false,
    unique: true,
    length: 8,
    default: () => "''",
    name: 'trigram',
  })
  trigram: string;

  @Column('character varying', {
    nullable: false,
    length: 8,
    default: () => "''",
    name: 'thirdpartyparent',
  })
  thirdpartyparent: string;

  @ManyToOne(
    () => country,
    (country: country) => country.thirdpartys,
    {},
  )
  @JoinColumn({ name: 'countryid' })
  country: country | null;

  @OneToMany(
    () => sourcingplan,
    (sourcingplan: sourcingplan) => sourcingplan.childthirdparty,
  )
  sourcingplans: sourcingplan[];

  @OneToMany(
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.maxeditthirdparty,
  )
  gpcusers: gpcuser[];

  @OneToMany(
    () => PreValidationPrice,
    (preValidationPrice: PreValidationPrice) => preValidationPrice.thirdparty,
  )
  preValidationPrices: PreValidationPrice[];

  @OneToMany(
    () => sourcingplan,
    (sourcingplan: sourcingplan) => sourcingplan.parentthirdparty,
  )
  sourcingplans2: sourcingplan[];

  @OneToMany(
    () => gpcuser,
    (gpcuser: gpcuser) => gpcuser.maxreadthirdparty,
  )
  gpcusers2: gpcuser[];

  @OneToMany(
    () => transaction,
    (transaction: transaction) => transaction.targetThirdparty,
  )
  transactions: transaction[];

  @OneToMany(
    () => IrtApplicationAppSettings,
    (irtapplicationappsettings: IrtApplicationAppSettings) => irtapplicationappsettings.thirdparty,
  )
  irtapplicationappsettingss: IrtApplicationAppSettings[];

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.thirdparty,
    { onUpdate: 'CASCADE' },
  )
  workloads: Workload[];

  @OneToMany(
    () => SubSidiaryAllocation,
    (subsidiaryallocation: SubSidiaryAllocation) => subsidiaryallocation.thirdparty,
    { onUpdate: 'CASCADE' },
  )
  subsidiaryallocations: SubSidiaryAllocation[];

  @OneToMany(
    () => MixSourcingStandard,
    (mixsourcingstandard: MixSourcingStandard) => mixsourcingstandard.thirdparty,
  )
  mixsourcingstandards: MixSourcingStandard[];

  @OneToMany(
    () => PortfolioAppSettings,
    (portfolioappsettings: PortfolioAppSettings) => portfolioappsettings.thirdparty,
  )
  portfolioappsettingss: PortfolioAppSettings[];

  @OneToMany(
    () => ThirdpartyAppSettings,
    (thirdpartyappsettings: ThirdpartyAppSettings) => thirdpartyappsettings.model,
  )
  thirdpartyappsettingss: ThirdpartyAppSettings[];

  @OneToMany(
    () => ServiceAppSettings,
    (serviceappsettings: ServiceAppSettings) => serviceappsettings.thirdparty,
  )
  serviceappsettingss: ServiceAppSettings[];

  @OneToMany(
    () => Price,
    (price: Price) => price.thirdparty,
  )
  prices: Price[];

  @OneToMany(
    () => GpcUser,
    (gpcuser: GpcUser) => gpcuser.thirdparty,
    { onUpdate: 'CASCADE' },
  )
  gpcusers3: GpcUser[];

  @OneToMany(
    () => SubService,
    (subservice: SubService) => subservice.thirdparty,
    { onUpdate: 'CASCADE' },
  )
  subservices: SubService[];
}
