import { MigrationInterface, QueryRunner, Table, TableForeignKey } from 'typeorm';

export class addMyViews1632841835677 implements MigrationInterface {
  MyViewsTable = new Table({
    name: 'my_views',
    columns: [
      {
        name: 'id',
        type: 'int',
        isPrimary: true,
        isGenerated: true,
        generationStrategy: 'increment',
      },
      {
        name: 'user_id',
        type: 'int',
      },
      {
        name: 'filter',
        type: 'jsonb',
      },
      {
        name: 'view_name',
        type: 'varchar',
      },
      {
        name: 'filter_name',
        type: 'varchar',
      },
      {
        name: 'created_date',
        type: 'date',
      },
    ],
  });

  userForeignKey = new TableForeignKey({
    columnNames: ['user_id'],
    referencedColumnNames: ['id'],
    referencedTableName: 'gpcuser',
    onDelete: 'CASCADE',
  });

  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.createTable(this.MyViewsTable, true);
    await queryRunner.createForeignKey(this.MyViewsTable, this.userForeignKey);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.dropTable(this.MyViewsTable, true);
    await queryRunner.dropForeignKey(this.MyViewsTable, this.userForeignKey);
  }
}
