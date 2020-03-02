import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Workload } from './../workloads/workload.entity';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { GpcAppSettings } from './../gpcappsettings/gpcappsettings.entity';

@Entity('gpcuser')
export class User {
  @Column({ length: 1024 })
  firstname: string | null;

  @Column({ length: 1024 })
  lastname: string | null;

  @Column({ length: 1024 })
  servicename: string | null;

  @Column({ length: 1024 })
  country: string | null;

  @Column()
  active: boolean | null;

  @Column({ length: 1024 })
  realm: string | null;

  @Column({ length: 1024 })
  username: string | null;

  @Column({ length: 1024 })
  password: string;

  @Column({ length: 1024 })
  credentials: string | null;

  @Column({ length: 1024 })
  challenges: string | null;

  @Column({ length: 1024 })
  email: string;

  @Column()
  emailverified: boolean | null;

  @Column({ length: 1024 })
  verificationtoken: string | null;

  @Column({ length: 1024 })
  status: string | null;

  @Column({ nullable: true })
  created: Date | null;

  @Column()
  lastupdated: Date | null;

  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(
    () => Thirdparty,
    (thirdparty: Thirdparty) => thirdparty.users,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'thirdpartyid' })
  thirdParty: Thirdparty;

  @ManyToOne(
    () => GpcAppSettings,
    (gpcAppSettings: GpcAppSettings) => gpcAppSettings.gpcusers,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcAppSettings: GpcAppSettings;

  @Column()
  bipcode: string | null;

  @ManyToOne(
    () => Thirdparty,
    (maxReadThirdParty: Thirdparty) => maxReadThirdParty.readers,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'maxreadthirdpartyid' })
  maxReadThirdParty: Thirdparty;

  @ManyToOne(
    () => Thirdparty,
    (maxEditThirdParty: Thirdparty) => maxEditThirdParty.editors,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'maxeditthirdpartyid' })
  maxEditThirdParty: Thirdparty;

  @Column({ type: 'int' })
  gpcappsettingsid: number | null;

  @Column('boolean', {
    nullable: true,
    name: 'ismanager',
  })
  ismanager: boolean | null;

  @OneToMany(
    () => Workload,
    (workload: Workload) => workload.personincharge,
    { onDelete: 'SET NULL' },
  )
  workloads: Workload[];
}
