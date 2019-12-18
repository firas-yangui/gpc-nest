import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('standalonemode', { schema: 'public' })
export class StandaloneMode {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('boolean', {
    nullable: true,
    name: 'ison',
  })
  ison: boolean | null;
}
