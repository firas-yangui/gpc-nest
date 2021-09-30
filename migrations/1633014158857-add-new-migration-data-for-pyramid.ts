import {MigrationInterface, QueryRunner} from "typeorm";

export class AddNewMigrationDataForPyramid1633014158857 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
        INSERT INTO importmapping (importname, mappingname, modelname, modelcolumn, mappedvalue, modelvalue )
        VALUES
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/ARC/BLR','3000371696'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/COO/BLR','3000371959'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/MGT/BLR','3000371976'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/ARC/BLR','3000371999'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/DAT/BLR','3000314913'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/DCS/BLR','3000371980'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/GSO/BLR','3000371992'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/ITF/BLR','3000371989'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/MGT/BLR','3000371994'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/REF/BLR','3000371979'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/ARC/CHN','3000371696'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/COO/CHN','3000371959'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/CRL/CHN','3000314928'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/FIN/CHN','3000314922'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/H2R/CHN','3000314934'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/ITO/CHN','3000314938'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/MGT/CHN','3000371976'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/SCR/CHN','3000371917'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/SEC/CHN','3000371866'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/CFT/TSR/CHN','3000371964'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/ARC/CHN','3000371999'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/DAT/CHN','3000314913'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/DCS/CHN','3000371980'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/GSO/CHN','3000371992'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/ITF/CHN','3000371989'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/MGT/CHN','3000371994'),
        ('PYRAMID', 'ORGA', 'Thirdparty', 'radical', 'GSC/DDS/REF/CHN','3000371979')
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {

    }

}
