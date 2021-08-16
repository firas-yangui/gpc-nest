import {MigrationInterface, QueryRunner,Table} from "typeorm";

export class createMappingCaPayorPartnerTrigramTable1629109896119 implements MigrationInterface {
    mappingTable = new Table({
        name: 'mapping_ca_payor_partner_trigram',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'libelle_ca_payor',
            type: 'varchar',
          },
          {
            name: 'partner_trigram',
            type: 'varchar',
          }
        ],
      });
    
      public async up(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.createTable(this.mappingTable, true);
      }
    
      public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.dropTable(this.mappingTable, true);
      }

}
