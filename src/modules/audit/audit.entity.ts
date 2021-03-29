import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { ApiModelProperty } from '@nestjs/swagger';
import { User } from '../user/user.entity';

@Entity('audit')
export class Audit {
  @ApiModelProperty()
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @ApiModelProperty()
  @Column('character varying', {
    nullable: true,
    name: 'modelname',
    length: 40,
  })
  modelName: string;

  @ApiModelProperty()
  @Column('character varying', {
    nullable: true,
    name: 'methodname',
    length: 6,
  })
  methodName: string;

  @ApiModelProperty()
  @CreateDateColumn({
    nullable: true,
    name: 'date',
  })
  date: Date;

  @ApiModelProperty()
  @Column('text', {
    nullable: true,
    default: null,
    name: 'oldobject',
  })
  oldObject: object;

  @ApiModelProperty()
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
