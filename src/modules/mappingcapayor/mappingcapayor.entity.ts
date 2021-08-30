import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('ca_payor')
export class MappingCaPayor {
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
}
