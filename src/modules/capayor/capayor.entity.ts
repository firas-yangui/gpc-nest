import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from '../activity/activity.entity';

@Entity('ca_payor')
export class CaPayor {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'code_ca_payor',
  })
  codeCaPayor: string;

  @Column('text', {
    nullable: false,
    name: 'libelle_ca_payor',
  })
  libelleCaPayor: string;

  @Column('text', {
    nullable: false,
    name: 'partner_trigram',
  })
  partnerTrigram: string;

  @OneToMany(
    () => CaPayor,
    (caPayor: CaPayor) => caPayor.activity,
    { onDelete: 'CASCADE' },
  )
  activity: Activity[];
}
