import { Column, Entity, Index, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { ProjectReporting } from './projectreporting';

@Entity('storage', { schema: 'public' })
@Index('storage_objectid_key', ['objectid'], { unique: true })
export class Storage {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'container',
  })
  container: string;

  @Column('text', {
    nullable: false,
    name: 'filename',
  })
  filename: string;

  @Column('text', {
    nullable: true,
    name: 'mimetype',
  })
  mimetype: string | null;

  @Column('integer', {
    nullable: false,
    unique: true,
    name: 'objectid',
  })
  objectid: number;

  @OneToMany(
    () => ProjectReporting,
    (projectreporting: ProjectReporting) => projectreporting.image,
    { onDelete: 'CASCADE' },
  )
  projectreportings: ProjectReporting[];
}
