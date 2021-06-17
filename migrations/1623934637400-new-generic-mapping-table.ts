import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class NewGenericMappingTable1623934637400 implements MigrationInterface {

    importMappingTable = new Table({
      name: 'importmapping',
      columns: [
        {
          name: 'id',
          type: 'int',
          isPrimary: true,
          isGenerated: true,
          generationStrategy: 'increment',
        },
        {
          name: 'importname',
          type: 'varchar',
        },
        {
          name: 'mappingname',
          type: 'varchar',
        },
        {
          name: 'modelname',
          type: 'varchar',
        },
        {
          name: 'modelcolumn',
          type: 'varchar',
        },
        {
          name: 'modelvalue',
          type: 'varchar',
        },
        {
          name: 'mappedvalue',
          type: 'varchar',
        },
      ],
    });

    public async up(queryRunner: QueryRunner): Promise<any> {
      return await queryRunner.createTable(this.importMappingTable, true);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
      return await queryRunner.dropTable('importmapping');
    }

}
