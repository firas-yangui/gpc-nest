import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('auditupload', { schema: 'public' })
export class AuditUpload {
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
    name: 'type',
  })
  type: string | null;

  @Column('text', {
    nullable: true,
    name: 'action',
  })
  action: string | null;

  @Column('text', {
    nullable: true,
    name: 'filename',
  })
  filename: string | null;

  @Column('integer', {
    nullable: true,
    name: 'numberoflines',
  })
  numberoflines: number | null;

  @Column('integer', {
    nullable: true,
    name: 'periodid',
  })
  periodid: number | null;

  @Column('real', {
    nullable: true,
    precision: 24,
    name: 'amount',
  })
  amount: number | null;

  @Column('text', {
    nullable: true,
    name: 'unit',
  })
  unit: string | null;

  @Column('integer', {
    nullable: true,
    name: 'referenceperiodid',
  })
  referenceperiodid: number | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'date',
  })
  date: Date | null;
}
