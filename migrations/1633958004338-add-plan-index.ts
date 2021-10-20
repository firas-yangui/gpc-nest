import { MigrationInterface, QueryRunner } from 'typeorm';

export class addPlanIndex1633958004338 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        create index subtypologyappsettings_plan_index
        on subtypologyappsettings (plan);
         `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP index subtypologyappsettings_plan_index;
         `);
  }
}
