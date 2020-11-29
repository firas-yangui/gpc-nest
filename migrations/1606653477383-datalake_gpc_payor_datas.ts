import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatalakeGpcPayorDatas1606653477383 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
            INSERT INTO datalake_gpc_payor (payorname, datalakepartnername, gpcpartnername)
            VALUES
            ('RESG/BSC/H2R/ODS/JMP','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/FAE/BDD/CDN','RESG/BSC','CDN'),
            ('RESG/BSC/FAT/TSV/PNV','RESG/BSC','BSC_TRA'),
            ('RESG/BSC/FAE/BDD/CGA','RESG/BSC','BDDF'),
            ('RESG/BSC/DCO/ODS/DEM','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/FAE/BDD/FRF','RESG/BSC','FRF'),
            ('RESG/BSC/FAT/TSV','RESG/BSC','BSC_AC'),
            ('RESG/BSC/DAT/ODS/DDD','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/DAT/VDF','RESG/BSC','BSC_AC'),
            ('RESG/BSC/DSO/ODS/AUT','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/CRL/ODS/OCR','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/DSO/VDF','RESG/BSC','BSC_AC'),
            ('RESG/BSC/FAE/DF./EBS','RESG/BSC','DFIN'),
            ('RESG/BSC/H2R/TSV','RESG/BSC','BSC_AC'),
            ('RESG/BSC/FAE/WAA/BEL','RESG/BSC','WAAM'),
            ('RESG/BSC/DAT/ODS/QDO','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/FAE/IRB/CGL','RESG/BSC','RESG_GSC'),
            ('RESG/BSC/FAE/DF./RESG/BSC','RESG/BSC','RESG_GSC'),
            ('RESG/BSC/DAT/ODS/DDD','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/H2R/ODS/SIM','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/H2R/ODS/PLS','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/FAE/WAA/BTL','RESG/BSC','WAAM'),
            ('RESG/BSC/H2R/ODS/TOK','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/FAE/IRB/CAP','RESG/BSC','RESG_GSC'),
            ('RESG/BSC/H2R/ODS/RIT','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/SCA','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/SHA','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/CHA','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/DCO/ODS/LIF','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/H2R/ODS/LIF','RESG/BSC','BSC_OdS'),
            ('RESG/BSC/multipayeur','RESG/BSC','BSC_AC'),
            ('RESG/BSC/FAE/ASS/MOO','RESG/BSC','ASSU_BSC'),
            ('RESG/BSC/FAT/TSV/CTA','RESG/BSC','BSC_TRA'),
            ('RESG/BSC/FAE/DF./GSC','RESG/BSC','RESG_GSC');
            `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_payor`);
  }
}
