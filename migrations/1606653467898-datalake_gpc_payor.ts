import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DatalakeGpcPayor1606653467898 implements MigrationInterface {
  payorTable = new Table({
    name: 'datalake_gpc_payor',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'payorname',
        type: 'varchar',
      },
      {
        name: 'gpcpartnername',
        type: 'varchar',
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.createTable(this.payorTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.dropTable(this.payorTable, true);
  }
}
