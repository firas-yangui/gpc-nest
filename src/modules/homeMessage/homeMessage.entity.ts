import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { GpcAppSettings } from '../gpcappsettings/gpcappsettings.entity';

@Entity('homemessage')
export class HomeMessageEntity {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('text', {
    nullable: false,
    default: '',
    name: 'message',
  })
  message: string;

  @Column('int', {
    nullable: true,
    name: 'gpcappsettingsid',
  })
  @ManyToOne(
    () => GpcAppSettings,
    (gpcappsettings: GpcAppSettings) => gpcappsettings.homeMessages,
    {},
  )
  @JoinColumn({ name: 'gpcappsettingsid' })
  gpcappsettings: GpcAppSettings | null;
}
