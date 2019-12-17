import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('user', { schema: 'public' })
export class user {
  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'realm',
  })
  realm: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'username',
  })
  username: string | null;

  @Column('character varying', {
    nullable: false,
    length: 1024,
    name: 'password',
  })
  password: string;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'credentials',
  })
  credentials: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'challenges',
  })
  challenges: string | null;

  @Column('character varying', {
    nullable: false,
    length: 1024,
    name: 'email',
  })
  email: string;

  @Column('boolean', {
    nullable: true,
    name: 'emailverified',
  })
  emailverified: boolean | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'verificationtoken',
  })
  verificationtoken: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'status',
  })
  status: string | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'created',
  })
  created: Date | null;

  @Column('timestamp with time zone', {
    nullable: true,
    name: 'lastupdated',
  })
  lastupdated: Date | null;

  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;
}
