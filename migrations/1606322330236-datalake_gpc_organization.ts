import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class DatalakeGpcOrganization1606322330236 implements MigrationInterface {
  OrganizationTable = new Table({
    name: 'datalake_gpc_organization',
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
      {
        name: 'projectname',
        type: 'varchar',
        isNullable: true,
      },
    ],
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.createTable(this.OrganizationTable, true);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    return await queryRunner.dropTable(this.OrganizationTable, true);
  }
}
