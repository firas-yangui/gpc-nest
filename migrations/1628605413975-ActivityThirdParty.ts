import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ActivityThirdParty1628605413975 implements MigrationInterface {
    ActivityThirdPartyTable = new Table({
        name: 'activity_thirdparty',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'percent',
            type: 'decimal',
          },
          {
            name: 'start_date',
            type: 'date',
          },
          {
            name: 'end_date',
            type: 'date',
          },
          {
            name: 'activity_id',
            type: 'int',
          },
          {
            name: 'thirdparty_id',
            type: 'int',
          },
        ],
      });

      activityForeignKey = new TableForeignKey({
        columnNames: ['activity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mtr_activity',
      });

      thirdPartyForeignKey = new TableForeignKey({
        columnNames: ['thirdparty_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'thirdparty',
      });

    public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.createTable(this.ActivityThirdPartyTable, true)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.dropTable(this.ActivityThirdPartyTable, true)
    }

}
