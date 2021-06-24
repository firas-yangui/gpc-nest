import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
@Entity('importmapping')
export class ImportMapping {
  @PrimaryGeneratedColumn({
    type: 'integer',
    name: 'id',
  })
  id: number;

  @Column('character varying', {
    nullable: false,
    length: 128,
    name: 'importname',
  })
  importName: string;

  @Column('character varying', {
    nullable: false,
    length: 128,
    name: 'mappingname',
  })
  mappingName: string;

  @Column('character varying', {
    nullable: false,
    length: 128,
    name: 'modelname',
  })
  modelName: string;

  @Column('character varying', {
    nullable: false,
    length: 128,
    name: 'modelcolumn',
  })
  modelColumn: string;

  @Column('character varying', {
    nullable: false,
    length: 128,
    name: 'modelvalue',
  })
  modelValue: string;

  @Column('character varying', {
    nullable: false,
    length: 128,
    name: 'mappedvalue',
  })
  mappedValue: string;
}
