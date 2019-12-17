import { Column, Entity } from 'typeorm';

@Entity('session', { schema: 'public' })
export class Session {
  @Column('character varying', {
    nullable: false,
    primary: true,
    name: 'sid',
  })
  sid: string;

  @Column('json', {
    nullable: false,
    name: 'sess',
  })
  sess: object;

  @Column('timestamp without time zone', {
    nullable: false,
    name: 'expire',
  })
  expire: Date;
}
