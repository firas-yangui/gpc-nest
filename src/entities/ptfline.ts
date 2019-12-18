import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ptfline', { schema: 'public' })
export class PtfLine {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('integer', {
    nullable: false,
    name: 'gpcuserid',
  })
  gpcuserid: number;

  @Column('text', {
    nullable: true,
    name: 'code',
  })
  code: string | null;

  @Column('text', {
    nullable: true,
    name: 'historicalid',
  })
  historicalid: string | null;

  @Column('text', {
    nullable: false,
    name: 'name',
  })
  name: string;

  @Column('text', {
    nullable: true,
    name: 'description',
  })
  description: string | null;

  @Column('text', {
    nullable: true,
    name: 'englishdescription',
  })
  englishdescription: string | null;

  @Column('text', {
    nullable: true,
    name: 'portfolioname',
  })
  portfolioname: string | null;

  @Column('text', {
    nullable: true,
    name: 'priority',
  })
  priority: string | null;

  @Column('text', {
    nullable: true,
    name: 'axis',
  })
  axis: string | null;

  @Column('text', {
    nullable: true,
    name: 'stake',
  })
  stake: string | null;

  @Column('text', {
    nullable: true,
    name: 'servicecode',
  })
  servicecode: string | null;

  @Column('text', {
    nullable: true,
    name: 'sponsor',
  })
  sponsor: string | null;

  @Column('text', {
    nullable: true,
    name: 'projectmanager',
  })
  projectmanager: string | null;

  @Column('text', {
    nullable: true,
    name: 'phase',
  })
  phase: string | null;

  @Column('date', {
    nullable: true,
    name: 'scopingenddate',
  })
  scopingenddate: string | null;

  @Column('date', {
    nullable: true,
    name: 'validationdate',
  })
  validationdate: string | null;

  @Column('date', {
    nullable: true,
    name: 'startingdate',
  })
  startingdate: string | null;

  @Column('date', {
    nullable: true,
    name: 'initialenddate',
  })
  initialenddate: string | null;

  @Column('date', {
    nullable: true,
    name: 'currentprojectenddate',
  })
  currentprojectenddate: string | null;

  @Column('integer', {
    nullable: true,
    name: 'initialbudget',
  })
  initialbudget: number | null;

  @Column('text', {
    nullable: true,
    name: 'cacode',
  })
  cacode: string | null;

  @Column('text', {
    nullable: true,
    name: 'irtapplicationcode',
  })
  irtapplicationcode: string | null;

  @Column('text', {
    nullable: true,
    name: 'subtypologycode',
  })
  subtypologycode: string | null;

  @Column('text', {
    nullable: true,
    name: 'var1',
  })
  var1: string | null;

  @Column('text', {
    nullable: true,
    name: 'var2',
  })
  var2: string | null;

  @Column('text', {
    nullable: true,
    name: 'var3',
  })
  var3: string | null;

  @Column('text', {
    nullable: true,
    name: 'var4',
  })
  var4: string | null;

  @Column('text', {
    nullable: true,
    name: 'var5',
  })
  var5: string | null;

  @Column('text', {
    nullable: true,
    name: 'programcode',
  })
  programcode: string | null;

  @Column('text', {
    nullable: true,
    name: 'thirdpartytrigram',
  })
  thirdpartytrigram: string | null;

  @Column('integer', {
    nullable: true,
    name: 'subserviceid',
  })
  subserviceid: number | null;
}
