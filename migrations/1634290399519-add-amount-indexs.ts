import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddAmountIndexs1634290399519 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            create index if not exists amount_keuros_index
                on amount (keuros);

            create index if not exists amount_keurossales_index
                on amount (keurossales);

            create index if not exists amount_klocalcurrency_index
                on amount (klocalcurrency);

            create index if not exists amount_mandays_index
                on amount (mandays);
         `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP index if exists amount_keuros_index;
            DROP index if exists amount_keurossales_index;
            DROP index if exists amount_klocalcurrency_index;
            DROP index if exists amount_mandays_index;
         `);
  }
}
