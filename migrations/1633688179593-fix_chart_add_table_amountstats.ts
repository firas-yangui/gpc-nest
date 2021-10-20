import { MigrationInterface, QueryRunner } from 'typeorm';

export class fixChartAddTableAmountstats1633688179593 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
     create table amountstats
     (
         id             serial
             constraint amountstats_pk
                 primary key,
         workloadid     int not null,
         thirdpartyid   int not null,
         serviceid      int not null,
         subserviceid   int not null,
         subnatureid    int not null,
         periodid       int not null,
         period_type    varchar,
         month          varchar(2),
         year           varchar(4),
         business_type  varchar(3),
         mandays        int,
         keuros         int,
         keurossales    int,
         klocalcurrency int
     );
     `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            DROP TABLE IF EXISTS amountstats;
         `);
  }
}
