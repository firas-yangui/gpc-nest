import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Workload } from './../workloads/workload.entity';

@Entity('gpcuser', { schema: 'public' })
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

  @Column()
  thirdpartyid: number | null;

  @Column()
  bipcode: string | null;

  @Column({ type: 'int' })
  maxreadthirdpartyid: number | null;

  @Column({ type: 'int' })
  maxeditthirdpartyid: number | null;

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
