import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Gpcappsettings } from './gpcappsettings';

@Entity('homemessage', { schema: 'public' })
export class Homemessage {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    default: () => "''",
    name: 'message',
  })
  message: string;

  @ManyToOne(
    () => Gpcappsettings,
    (gpcappsettings: Gpcappsettings) => gpcappsettings.homemessages,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: gpcappsettings | null;
}
