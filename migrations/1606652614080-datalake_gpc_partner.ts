import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DatalakeGpcPartner1606652614080 implements MigrationInterface {
  partnerTable = new Table({
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
        name: 'datalakename',
        type: 'varchar',
      },
      {
        name: 'gpcname',
        type: 'varchar',
      },
    ],
  });
  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.createTable(this.partnerTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.dropTable(this.partnerTable, true);
  }
}
