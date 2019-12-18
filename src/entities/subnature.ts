import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { price } from './price';
import { mixsourcingstandard } from './mixsourcingstandard';
import { PreValidationPrice } from './pre_validation_price';
import { Workload } from './workload';
import { SubNatureAppSettings } from './subnatureappsettings';
import { BipExceptionRule } from './bipexceptionrule';
import { SourcingPlan } from './sourcingplan';

@Entity('subnature', { schema: 'public' })
@Index('subnature_code_unique_idx', ['code'], { unique: true })
export class SubNature {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 16,
    name: 'code',
  })
  code: string;

  @Column('character varying', {
    nullable: false,
    length: 32,
    name: 'name',
  })
  name: string;

  @Column('text', {
    nullable: false,
    default: () => "'KEURO'",
    name: 'amountunit',
  })
  amountunit: string;

  @Column('boolean', {
    nullable: true,
    default: () => 'true',
    name: 'iscashout',
  })
  iscashout: boolean | null;

  @Column('boolean', {
    nullable: false,
    default: () => 'false',
    name: 'isworkforce',
  })
  isworkforce: boolean;

  @OneToMany(
    () => price,
    (price: price) => price.subnature,
  )
  prices: price[];

  @OneToMany(
    () => mixsourcingstandard,
    (mixsourcingstandard: mixsourcingstandard) => mixsourcingstandard.subnature,
  )
  mixsourcingstandards: mixsourcingstandard[];

  @OneToMany(
    () => PreValidationPrice,
    (pre_validation_price: PreValidationPrice) => pre_validation_price.subnature,
  )
  preValidationPrices: PreValidationPrice[];

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.subnature,
    { onUpdate: 'CASCADE' },
  )
  workloads: Workload[];

  @OneToMany(
    () => SubNatureAppSettings,
    (subnatureappsettings: SubNatureAppSettings) => subnatureappsettings.model,
  )
  subnatureappsettingss: SubNatureAppSettings[];

  @OneToMany(
    () => BipExceptionRule,
    (bipexceptionrule: BipExceptionRule) => bipexceptionrule.subnature,
  )
  bipexceptionrules: BipExceptionRule[];

  @OneToMany(
    () => SourcingPlan,
    (sourcingplan: SourcingPlan) => sourcingplan.subnature,
  )
  sourcingplans: SourcingPlan[];
}
