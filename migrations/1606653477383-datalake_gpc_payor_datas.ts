import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatalakeGpcPayorDatas1606653477383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            INSERT INTO datalake_gpc_payor (payorname, gpcpartnername)
            VALUES
            ('RESG/BSC/H2R/ODS/JMP','BSC_OdS'),
            ('RESG/BSC/FAE/BDD/CDN','CDN'),
            ('RESG/BSC/FAT/TSV/PNV','BSC_TRA'),
            ('RESG/BSC/FAE/BDD/CGA','BDDF'),
            ('RESG/BSC/DCO/ODS/DEM','BSC_OdS'),
            ('RESG/BSC/FAE/BDD/FRF','FRF'),
            ('RESG/BSC/FAT/TSV','BSC_AC'),
            ('RESG/BSC/DAT/ODS/DDD','BSC_OdS'),
            ('RESG/BSC/DAT/VDF','BSC_AC'),
            ('RESG/BSC/DSO/ODS/AUT','BSC_OdS'),
            ('RESG/BSC/CRL/ODS/OCR','BSC_OdS'),
            ('RESG/BSC/DSO/VDF','BSC_AC'),
            ('RESG/BSC/FAE/DF./EBS','DFIN'),
            ('RESG/BSC/H2R/TSV','BSC_AC'),
            ('RESG/BSC/FAE/WAA/BEL','WAAM'),
            ('RESG/BSC/DAT/ODS/QDO','BSC_OdS'),
            ('RESG/BSC/FAE/IRB/CGL','RESG_GSC'),
            ('RESG/BSC/FAE/DF./RESG/BSC','RESG_GSC'),
            ('RESG/BSC/DAT/ODS/DDD','BSC_OdS'),
            ('RESG/BSC/H2R/ODS/SIM','BSC_OdS'),
            ('RESG/BSC/H2R/ODS/PLS','BSC_OdS'),
            ('RESG/BSC/FAE/WAA/BTL','WAAM'),
            ('RESG/BSC/H2R/ODS/TOK','BSC_OdS'),
            ('RESG/BSC/FAE/IRB/CAP','RESG_GSC'),
            ('RESG/BSC/H2R/ODS/RIT','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/SCA','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/SHA','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/CHA','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/LIF','BSC_OdS'),
            ('RESG/BSC/H2R/ODS/LIF','BSC_OdS'),
            ('RESG/BSC/multipayeur','BSC_AC'),
            ('RESG/BSC/FAE/ASS/MOO','ASSU_BSC'),
            ('RESG/BSC/FAT/TSV/CTA','BSC_TRA'),
            ('RESG/BSC/FAE/DF./GSC','RESG_GSC');
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_payor`);
  }
}
