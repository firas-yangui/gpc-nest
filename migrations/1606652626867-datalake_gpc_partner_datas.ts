import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatalakeGpcPartnerDatas1606652626867 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
        INSERT INTO datalake_gpc_partner (datalakename, gpcname)
        VALUES
        ('WAAM','WAAM'),
        ('TRANSACTIS','TRS'),
        ('SGSS','SGSS'),
        ('SGEF','SGEF_BSC'),
        ('SEGL','SEGL'),
        ('RUSS','RUSS_BSC'),
        ('RESG/TPS','RESG_TPS'),
        ('RESG/SGC','RESG_SGC'),
        ('RESG/DIR','RESG_DIR'),
        ('BSC_TRA','BSC_TRA'),
        ('BSC_OdS','BSC_OdS'),
        ('BSC_AC','BSC_AC'),
        ('MARK','MARK'),
        ('ITIM','ITIM'),
        ('RESG/IMM','RESG_IMM'),
        ('IGAD','IGAD'),
        ('RESG/GTS','RESG/GTS'),
        ('GTPS','GTPS'),
        ('RESG_GSC','RESG_GSC'),
        ('GLBA','GLBA'),
        ('GBSU','GBSU'),
        ('FRF','FRF'),
        ('EURO','EURO_BSC'),
        ('DGLE','DGLE'),
        ('DFIN','DFIN'),
        ('CPLE','CPLE'),
        ('COMM','COMM'),
        ('CDN','CDN'),
        ('BDDF','BDDF'),
        ('ASSU','ASSU_BSC'),
        ('AMER','AMER'),
        ('ALDA','ALDA_BSC'),
        ('AFMO','AFMO_BSC'),
        ('RESG/ACH','RESG_ACH'),
        ('HRCO','HRCO'),
        ('RISQ','RISQ'),
        ('IRBS','AFMO_BSC'),
        ('GSPR','GSPR');
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_partner`);
  }
}
