import { MigrationInterface, QueryRunner } from 'typeorm';

export class DatalakeGpcOrganizationDatas1606398396775 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`
    INSERT INTO datalake_gpc_organization (datalakename, gpcname, projectname)
    VALUES
    ('GSC/H2R/RHP','H2R/RHP',NULL),
    ('GSC/H2R/RHG','H2R/RHG',NULL),
    ('GSC/H2R/RHC','H2R/RHC',NULL),
    ('GSC/H2R/ICA','H2R/ICA',NULL),
    ('GSC/H2R/ESM','H2R/ESM',NULL),
    ('GSC/H2R/COP','H2R/COP',NULL),
    ('GSC/H2R/COO','H2R/COO',NULL),
    ('GSC/H2R/AST','H2R/AST',NULL),
    ('GSC/DSO/TAD','DSO/TAD',NULL),
    ('GSC/DSO/SRS','DSO/SRS',NULL),
    ('GSC/DSO/SEC','DSO/SEC',NULL),
    ('GSC/DSO/GSO','DSO/GSO',NULL),
    ('GSC/DSO/COO','DSO/COO',NULL),
    ('GSC/DSO/AST','DSO/AST',NULL),
    ('GSC/DAT/TPA','DAT/TPA',NULL),
    ('GSC/DAT/SOP','DAT/SOP',NULL),
    ('GSC/DAT/REF','DAT/REF',NULL),
    ('GSC/DAT/INO','DAT/INO',NULL),
    ('GSC/DAT/DEX','DAT/DEX',NULL),
    ('GSC/DAT/DEC','DAT/DEC',NULL),
    ('GSC/DAT/COO','DAT/COO',NULL),
    ('GSC/DAT/AST','DAT/AST',NULL),
    ('GSC/CRL/SGL','CRL/SGL',NULL),
    ('GSC/CRL/ROC','CRL/ROC',NULL),
    ('GSC/CRL/PCT','CRL/PCT',NULL),
    ('GSC/CRL/IGA','CRL/IGA',NULL),
    ('GSC/CRL/CPL','CRL/CPL',NULL),
    ('GSC/CRL/COO','CRL/COO',NULL),
    ('GSC/CRL/CDA','CRL/CDA',NULL),
    ('GSC/CRL/AST','CRL/AST',NULL),
    ('GSC/ARS/PAM','ARS/PAM',NULL),
    ('GSC/ARS/OPE','ARS/OPE',NULL),
    ('GSC/ARS/MCR','ARS/MCR',NULL),
    ('GSC/ARS/CSD','ARS/CSD',NULL),
    ('GSC/ARS/CRP','ARS/CRP',NULL),
    ('GSC/ARS/COO','ARS/COO',NULL),
    ('GSC/ARS/CAL','ARS/CAL',NULL),
    ('GSC/ARS/AST','ARS/AST',NULL),
    ('GSC/ARS/ALM','ARS/ALM',NULL),
    ('GSC/ARC/TEA','ARC/TEA',NULL),
    ('GSC/ARC/S&C','ARC/S&C',NULL),
    ('GSC/ARC/FSK','ARC/FSK',NULL),
    ('GSC/ARC/DPR','ARC/DPR',NULL),
    ('GSC/ARC/DEA','ARC/DEA',NULL),
    ('GSC/ARC/COO','ARC/COO',NULL),
    ('GSC/ARC/AEA','ARC/AEA',NULL),
    ('GSC/FIN/AST','FIN/AST',NULL),
    ('GSC/FIN/COO','FIN/COO',NULL),
    ('GSC/FIN/FDA','FIN/FDA',NULL),
    ('GSC/FIN/FPM','FIN/FPM',NULL),
    ('GSC/FIN/GTR','FIN/GTR',NULL),
    ('GSC/FIN/PAC','FIN/PAC',NULL),
    ('GSC/FIN/RSR','FIN/RSR',NULL),
    ('GSC/COO/KMT','COO/KMT',NULL),
    ('GSC/COO/MGX','COO/MGX',NULL),
    ('GSC/COO/PRF','COO/PRF',NULL),
    ('GSC/COO/TRF','COO/TRF',NULL),
    ('HRCO/COO','HRCO/COO',NULL),
    ('HRCO/DIR','HRCO/DIR',NULL),
    ('HRCO/HRCO GBI','HRCO/HRCO GBI',NULL),
    ('HRCO/PRO/DPR','HRCO/PRO/DPR',NULL),
    ('HRCO/PRO/SOL','HRCO/PRO/SOL',NULL),
    ('HRCO/PRO/ISM','HRCO/PRO/ISM',NULL),
    ('HRCO/PRO/TRA','HRCO/PRO/TRA',NULL),
    ('HRCO/SOF','HRCO/SOF',NULL),
    ('HRCO/TAL','HRCO/TAL',NULL),
    ('HRCO/ELE','HRCO/ELE',NULL),
    ('HRCO/HRS','HRCO/HRS',NULL),
    ('HRCO/SSC/SOF ','HRCO/SOF',NULL),
    ('GSC/DIR/DIR','DIR/DIR',NULL),
    ('GSC/ARC/ARC/ARC','ARC/TEA',NULL),
    ('GSC/BSC/DIR/DIR','DIR/DIR',NULL),
    ('GSC/COO/COO/COO','COO/PRF',NULL),
    ('GSC/DAT/DAT/INO','DAT/INO',NULL),
    ('GSC/DAT/DAT/MGT','DAT/COO',NULL),
    ('GSC/FIN/FIN/MGT','FIN/PAC',NULL),
    ('GSC/CRL/MGT/MGT','CRL/CPL','MINT'),
    ('GSC/CRL/MGT/MGT','CRL/ROC','PCT CN2'),
    ('GSC/CRL/MGT/MGT','CRL/ROC','PCT DATALAKE'),
    ('GSC/CRL/MGT/MGT','CRL/ROC','PCT FRAMEWORK - MyAPRC'),
    ('GSC/CRL/MGT/MGT','CRL/CPL','RCI'),
    ('GSC/CRL/MGT/MGT','CRL/ROC','RCSA'),
    ('GSC/CRL/MGT/MGT','CRL/CPL','REPOSITORY'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - Archive Catalog - A2589'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - Control Statement - A8359'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - Embargos'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - Legal Reporting LRT - A2664'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - Trip Authorization - A8312'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - TSP Litigation - A8373'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB - Whitebook'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','RTB-Legal Directory A2637'),
    ('GSC/CRL/MGT/MGT','CRL/IGA','Run Transverse Divers CRL IGA'),
    ('GSC/CRL/MGT/MGT','CRL/IGA','Support IGAD'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','Tableau de bord pilotage sécurité'),
    ('GSC/CRL/MGT/MGT','CRL/CPL','TALKS'),
    ('GSC/CRL/MGT/MGT','CRL/SGL','TSP - Disputes - Panda'),
    ('GSC/CRL/MGT/MGT','CRL/CPL','Whistleblowing'),
    ('GSC/ARS/ARS/MGT','ARS/CAL','CRC Jarvis'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','A2359-SyRis Global'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','A2792 WATCHLIST'),
    ('GSC/ARS/ARS/MGT','ARS/CAL','A2770 -CRP Production Application'),
    ('GSC/ARS/ARS/MGT','ARS/CRP','RUN - A2389 - Safir - RISQ'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','A8346 EDP - Balise'),
    ('GSC/ARS/ARS/MGT','ARS/ALM','CTBE - Evolutive Maintenance IRRBB'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','MANAGEMENT MCR'),
    ('GSC/ARS/ARS/MGT','ARS/CAL','A2679 - RBO Production Application'),
    ('GSC/ARS/ARS/MGT','ARS/AST','ARS AST Contribution Shared SI'),
    ('GSC/ARS/ARS/MGT','ARS/ALM','RTB - A2540 - BASYLIQ'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','TOM Crédit - BP2R'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','NOVA - Refonte Notation'),
    ('GSC/ARS/ARS/MGT','ARS/CSD','Production FINREP - Alimentation ERG EVOLAN à partir du Datalake'),
    ('GSC/ARS/ARS/MGT','ARS/ALM','Programme PRR - RTA'),
    ('GSC/ARS/ARS/MGT','ARS/MCR','CRYSTAL (CP2 Remediation)'),
    ('GSC/ARS/ARS/MGT','ARS/CSD','Maille Contrat'),
    ('GSC/ARS/ARS/MGT','ARS/CRP','ANACREDIT SIMUT'),
    ('GSC/ARS/ARS/MGT','ARS/CRP','FINREP transformation'),
    ('GSC/DAT/DAT/MGT','DAT/REF','A2254 - Change et RUN ODS 3D'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','A2881 - DQLINK MEV DEC'),
    ('GSC/DAT/DAT/MGT','DAT/REF','Sakkarah Referential'),
    ('GSC/DAT/DAT/MGT','DAT/REF','ERECA Run'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','RUN SQD et DQL TPS'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','A8361 - CARMA RUN  DEC'),
    ('GSC/DAT/DAT/MGT','DAT/SOP','Service offer - RTB - Socle Big Data'),
    ('GSC/DAT/DAT/MGT','DAT/REF','ERECA MEV'),
    ('GSC/DAT/DAT/MGT','DAT/TPA','DIAM Federative Assets RUN'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','RUN STP PERLE'),
    ('GSC/DAT/DAT/MGT','DAT/REF','I2R Transversal Tasks'),
    ('GSC/DAT/DAT/MGT','DAT/COO','RCT Evolutive maintenance'),
    ('GSC/DAT/DAT/MGT','DAT/REF','A2582 - Change et Run SEG'),
    ('GSC/DAT/DAT/MGT','DAT/COO','Paid Maternity Leaves'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','Vizir activities'),
    ('GSC/DAT/DAT/MGT','DAT/COO','QDO GBIS Amer Support'),
    ('GSC/DAT/DAT/MGT','DAT/TPA','DIAM Federative Assets'),
    ('GSC/DAT/DAT/MGT','DAT/REF','PERLE'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','ESS'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','[OP CAP] One Data Management'),
    ('GSC/DAT/DAT/MGT','DAT/TPA','Offboarding - Duplicates'),
    ('GSC/DAT/DAT/MGT','DAT/TPA','CROSS'),
    ('GSC/DAT/DAT/MGT','DAT/DEC','Squad 2020'),
    ('GSC/DAT/DAT/MGT','DAT/TPA','Donnees financieres TIERS'),
    ('GSC/DAT/DAT/MGT','DAT/SOP','CORAL - Tiers'),
    ('GSC/DAT/DAT/MGT','DAT/INO','[INNOVATION] Animation Innovation'),
    ('GSC/CRL/CDA/MGT','CRL/CDA', NULL),
    ('GSC/H2R/H2R/MGT','H2R/RHG','A2732 - COSY'),
    ('GSC/H2R/H2R/MGT','H2R/RHP','R_RU_HRCO_GBI_Transversal'),
    ('GSC/H2R/BLR/ML','H2R/COO','Paid Maternity Leaves'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','MEV-Formation'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','Run_Formation'),
    ('GSC/H2R/H2R/MGT','H2R/ESM','ODS-ESM-JUMP-CHORUS-MEV'),
    ('GSC/H2R/H2R/MGT','H2R/ICA','Pilotage IMM'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','Multi appli A2515 - Evaluation - A2531 Talent'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','A2585 - PSG'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','A2516 - HRE - RUN'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','A2736 - JOBatSG'),
    ('GSC/H2R/BLR/ML','H2R/ESM','ODS-ESM-JUMP-CHORUS-RUN'),
    ('GSC/H2R/CHE/ML','H2R/COO','Paid Maternity Leaves'),
    ('GSC/H2R/H2R/MGT','H2R/RHG','Phoenix'),
    ('GSC/H2R/H2R/MGT','H2R/COP','Corporate Platform - Employee Portal'),
    ('GSC/H2R/H2R/MGT','H2R/RHC','Stream 0 - Transversal (Program HR For You)'),
    ('GSC/H2R/H2R/MGT','H2R/RHC','Stream 3 - HR Data'),
    ('GSC/H2R/H2R/MGT','H2R/COO','[SOURCING] Sourcing offshore'),
    ('GSC/DSO/BLR/ML ','DSO/COO',NULL),
    ('GSC/CRL/BLR/ML','CRL/COO',NULL);
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_organization`);
  }
}
