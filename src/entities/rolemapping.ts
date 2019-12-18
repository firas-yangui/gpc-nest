import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rolemapping', { schema: 'public' })
export class RoleMapping {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'principaltype',
  })
  principaltype: string | null;

  @Column('character varying', {
    nullable: true,
    length: 1024,
    name: 'principalid',
  })
  principalid: string | null;

  @Column('integer', {
    nullable: true,
    name: 'roleid',
  })
  roleid: number | null;
}
