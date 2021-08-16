import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('mapping_ca_payor_partner_trigram')
export class MappingCaPayor {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    name: 'libelle_ca_payor',
  })
  caPayor: string;

  @Column('text', {
    nullable: false,
    name: 'partner_trigram',
  })
  partnerTrigram: string;
}
