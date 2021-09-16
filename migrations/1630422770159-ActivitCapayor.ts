import {MigrationInterface, QueryRunner, Table, TableForeignKey} from "typeorm";

export class ActivitCapayor1630422770159 implements MigrationInterface {

    ActivityCapayorTable = new Table({
        name: 'activity_capayor',
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
            name: 'capayor_id',
            type: 'int',
          },
        ],
      });

      activityForeignKey = new TableForeignKey({
        columnNames: ['activity_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'mtr_activity',
      });

      capayorForeignKey = new TableForeignKey({
        columnNames: ['capayor_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'ca_payor',
      });

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.createTable(this.ActivityCapayorTable, true)
        await queryRunner.createForeignKey(this.ActivityCapayorTable, this.activityForeignKey)
        await queryRunner.createForeignKey(this.ActivityCapayorTable, this.capayorForeignKey)
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.dropTable(this.ActivityCapayorTable, true)
        await queryRunner.dropForeignKey(this.ActivityCapayorTable, this.activityForeignKey)
        await queryRunner.dropForeignKey(this.ActivityCapayorTable, this.capayorForeignKey)
    }

}