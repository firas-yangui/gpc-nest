import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity('audit')
export class Audit {
  @ApiProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiProperty()
  @Column('character varying', {
    nullable: true,
    name: 'modelname',
    length: 40,
  })
  modelName: string;

  @ApiProperty()
  @Column('character varying', {
    nullable: true,
    name: 'methodname',
    length: 6,
  })
  methodName: 'create' | 'update' | 'delete';

  @ApiProperty()
  @CreateDateColumn({
    nullable: true,
    name: 'date',
  })
  date: Date;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    default: null,
    name: 'oldobject',
  })
  oldObject: object;

  @ApiProperty()
  @Column('text', {
    nullable: true,
    default: null,
    name: 'newobject',
  })
  newObject: object;

  @ManyToOne(
    () => User,
    (user: User) => user.audits,
    { nullable: false, onUpdate: 'CASCADE' },
  )
  @JoinColumn({ name: 'userid' })
  user: User;
}
