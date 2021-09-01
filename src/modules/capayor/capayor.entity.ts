import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { Activity } from '../activity/activity.entity';

@Entity('ca_payor')
export class CaPayor {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty()
  @Column('text', {
    nullable: false,
    name: 'code_ca_payor',
  })
  codeCaPayor: string;
  @ApiProperty()
  @Column('text', {
    nullable: false,
    name: 'libelle_ca_payor',
  })
  libelleCaPayor: string;
  @ApiProperty()
  @Column('text', {
    nullable: false,
    name: 'partner_trigram',
  })
  partnerTrigram: string;
  @ApiProperty()
  @OneToMany(
    () => CaPayor,
    (caPayor: CaPayor) => caPayor.activity,
    { onDelete: 'CASCADE' },
  )
  activity: Activity[];
}
