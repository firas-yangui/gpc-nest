import {MigrationInterface, QueryRunner,Table} from "typeorm";

export class createMappingCaPayorPartnerTrigramTable1629109896119 implements MigrationInterface {
    mappingTable = new Table({
        name: 'ca_payor',
        columns: [
          {
            name: 'id',
            type: 'int',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'code_ca_payor',
            type: 'varchar',
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
        await queryRunner.createTable(this.mappingTable, true);

        return await queryRunner.query(`
        INSERT INTO ca_payor (code_ca_payor, libelle_ca_payor, partner_trigram)
        VALUES
          ('3000387925','YOGA IT CTA CONSOLIDATION','NB25'),
          ('3000387933','YOGA IT CTA DIRECTION DE PROGRAMME','NB25'),
          ('3000387941','YOGA IT CTA FABRICATION ENVIRON','NB25'),
          ('3000387946','NB25/ICT/YCO/DCE','NB25'),
          ('3000387949','YOGA IT CTA URTA','NB25'),
          ('3000387957','YOGA IT CTA ECARTS FONCTIONNELS','NB25'),
          ('3000387965','YOGA IT CTA MARQUES','NB25'),
          ('3000387973','YOGA IT CTA IMPACTS TRANSVERSES','NB25'),
          ('3000387981','CLIENT ET ORGANISATION RESEAU','NB25'),
          ('3000387989','MODELE OPERATIONNEL','NB25'),
          ('3000387997','BANQUE PRIVEE','NB25'),
          ('3000327568','RESG/SGC','RESG/SGC'),
          ('3000339790','RESG/CFT/FAE/ALD','ALDA'),
          ('3000387740','ALDA/SUG','ALDA'),
          ('3000319487','RESG/CFT/FAE/ALD/AUT','ALDA'),
          ('3000317525','RESG/CFT/FAE/AFM/MAR','AFMO'),
          ('3000387736','AFMO/HQE/SUG','AFMO'),
          ('3000387859','AFMO/HQE/HUM','AFMO'),
          ('3000319759','AFMO/HQE/PRO/BIS','AFMO'),
          ('3000319839','AFMO/HQE/PRO/UEM','AFMO'),
          ('3000319007','RESG/CFT/FAE/AFM/CON','AFMO'),
          ('3000329253','RESG/CFT/FAE/AFM/SEN','AFMO'),
          ('3000319496','RESG/CFT/FAE/ASS/SUR','ASSU'),
          ('3000346418','RESG/CFT/FAE/ASS','ASSU'),
          ('3000387743','ASSU/SUG','ASSU'),
          ('3000328970','ASSU ASS VIE DETACHES SOGECAP ','ASSU'),
          ('3000319495','RESG/CFT/FAE/ASS/CAP','ASSU'),
          ('3000328746','EURO/HQE/FIL/CES','EURO'),
          ('3000327945','EURO/BAN/APE','EURO'),
          ('3000338093','RESG/CFT/FAE/EUR','EURO'),
          ('3000387746','EURO/HQE/SUG','EURO'),
          ('3000319478','RESG/CFT/FAE/EUR/BRD','EURO'),
          ('3000319480','RESG/CFT/FAE/EUR/KBA','EURO'),
          ('3000339653','RESG/CFT/FAE/RUS','RUSS'),
          ('3000387752','RUSS/SUG','RUSS'),
          ('3000319479','RESG/CFT/FAE/RUS/RBK','RUSS'),
          ('3000348126','RESG/CFT/FAE/SGE','SGEF'),
          ('3000387756','SGEF/SUG','SGEF'),
          ('3000319484','RESG/CFT/FAE/SGE','SGEF'),
          ('3000318015','IRBA/MKG','IRBA'),
          ('3000316471','IRBS/IRB/SME/MCE','IRBS'),
          ('3000319753','IRBS/PRO/MBA','IRBS'),
          ('3000319635','IRBS/IRB','IRBS'),
          ('3000326260','IRBS/CLO/HUM','IRBS'),
          ('3000316388','IRBS/PRO/PRD','IRBS'),
          ('3000318064','IRBS/CLO/SEG','IRBS'),
          ('3000328051','IRBS/PRO/IFR','IRBS'),
          ('3000316902','IRBS/PRO/KYC','IRBS'),
          ('3000326913','BDDF/DGE/CDT/PRT','BDDF'),
          ('3000329751','BDDF/HUM/DEV','BDDF'),
          ('3000316272','BDDF/PAY/SOL/SAP/BDD','BDDF'),
          ('3000317844','BDDF/HUM/FOR/ANI/PIL','BDDF'),
          ('3000326935','BDDF/DGE/RIS','BDDF'),
          ('3000327962','BDDF/PAY/SOL/SAP/IPA','BDDF'),
          ('3000328857','BDDF/PAY/SOL/SAP/CHQ','BDDF'),
          ('3000319341','RESG/CFT/FAE/BDD/SGP','BDDF'),
          ('3000327284','BDDF/DGE/CDG/DIV','BDDF'),
          ('3000317953','BDDF/DGE/DIV/ETU/NEW','BDDF'),
          ('3000387809','BDDF/PAY/SOL/PRJ/TTP','BDDF'),
          ('3000326257','BDDF/HUM/O&L','BDDF'),
          ('3000327212','BDDF/IMM/DAI/SFI','BDDF'),
          ('3000329842','BDDF/PAY/SOL/MON/BDD','BDDF'),
          ('3000316957','BDDF/DGE/PSC','BDDF'),
          ('3000319483','RESG/CFT/FAE/BDD/FRF','BDDF'),
          ('3000328551','BDDF/DGE/PIL','BDDF'),
          ('3000326981','BDDF/DGE/TEN/COM','BDDF'),
          ('3000316966','BDDF/PAY/SOL/SAP','BDDF'),
          ('3000327220','BDDF/DGE/LOG/IMM','BDDF'),
          ('3000326397','BDDF/PAY/SOL/MON/PAR','BDDF'),
          ('3000327910','BDDF/DIR','BDDF'),
          ('3000329494','BDDF/IMM/LOG','BDDF'),
          ('3000316068','BDDF/CLI','BDDF'),
          ('3000316270','BDDF/PAY/SAP','BDDF'),
          ('3000327996','BDDF/SEG','BDDF'),
          ('3000329613','BDDF HUM GESTION RH GTPS VDF','BDDF'),
          ('3000319476','RESG/CFT/FAE/BDD/CDN','CDN'),
          ('3000319476_20200211','RESG/BSC/FAE/BDD/CDN old','CDN'),
          ('3000319465','COMM/FAC/BSC','COMM'),
          ('3000316426','COMM/BUD/FIL','COMM'),
          ('3000317888','COMM/GBN/GBI','COMM'),
          ('3000319359','CPLE/FCC/EMB/SAM/ITC','CPLE'),
          ('3000319698','CPLE/KTP/ITC','CPLE'),
          ('3000319702','CPLE/LAF/ITC','CPLE'),
          ('3000328896','CPLE/LAF','CPLE'),
          ('3000387773','CPLE/COO/ACA','CPLE'),
          ('3000387786','CPLE/ROA','CPLE'),
          ('3000316903','CPLE/DTO','CPLE'),
          ('3000327930','CPLE/DIR/CTA','CPLE'),
          ('3000319149','DFIN/DTO/RUN/AUT','DFIN'),
          ('3000387885','DFIN/DTO/RUN/WHO','DFIN'),
          ('3000319623','DFIN/DTO/RUN/SRF','DFIN'),
          ('3000327396','DFIN/SGS/PAR','DFIN'),
          ('3000316411','DFIN/DTO/GPF','DFIN'),
          ('3000326353','DFIN/BDF/RDM/VDF','DFIN'),
          ('3000327912','DFIN/DTO/DIR','DFIN'),
          ('3000327904','DFIN/DTO/LIQ','DFIN'),
          ('3000319622','DFIN/DTO/SRF','DFIN'),
          ('3000319768','DFIN/DTO/RUN/LIQ','DFIN'),
          ('3000387878','DFIN/DTO/WHO','DFIN'),
          ('3000319247','DFIN/DOM/ACR/DIR','DFIN'),
          ('3000326255','DFIN/DIR/CTA','DFIN'),
          ('3000319822','DGLE/C&C','DGLE'),
          ('3000387895','DGLE/FSI/ISC/TRV','DGLE'),
          ('3000317586','DGLE/INO/DIR','DGLE'),
          ('3000387873','DGLE/PCT','DGLE'),
          ('3000327584','DGLE/PIC','DGLE'),
          ('3000318522','DGLE','DGLE'),
          ('3000328520','DGLE/ERM','DGLE'),
          ('3000328903','GBIS/BSC/FIN/DIV','GBIS'),
          ('3000317240','GBIS/COO','GBIS'),
          ('3000326477','GBIS/BSC/PRJ','GBIS'),
          ('3000318756','GBSU/COO/DIR','GBSU'),
          ('3000388219','GBSU/TEC/ACT/RES/BSC','GBSU'),
          ('3000388233','GBSU/TEC/PRE/RES/BSC','GBSU'),
          ('3000326531','GBSU/FTB/TRA','GBSU'),
          ('3000317268','GBSU/DCS','GBSU'),
          ('3000329448','GBSU/SGS/SBO/PAR','GBSU'),
          ('3000326337','GBSU/CLD/DIR','GBSU'),
          ('3000329047','GBSU/CLD/CLT','GBSU'),
          ('3000326973','GBSU/DIR/ITC','GBSU'),
          ('3000326926','GBSU/FTB/RPP','GBSU'),
          ('3000317269','GBSU/SGS/TMS/NAN','GBSU'),
          ('3000329485','GBSU/SGS/FAC/GTS','GBSU'),
          ('3000327698','GBSU/RPM/PRJ','GBSU'),
          ('3000326356','GBSU/COO/CRM','GBSU'),
          ('3000316368','GBSU/SGS/PAR/DET','GBSU'),
          ('3000318899','GBSU/COO/ISS','GBSU'),
          ('3000319938','GBSU/CLD/REF/DIR','GBSU'),
          ('3000387555','GLBA/TEC/ACT/RES/DDS','GLBA'),
          ('3000387556','GLBA/TEC/PRE/RES/DDS','GLBA'),
          ('3000388247','GLBA/TEC/ACT/RES/BSC','GLBA'),
          ('3000388261','GLBA/TEC/PRE/RES/BSC','GLBA'),
          ('3000318466','GLBA/CMA/DIR','GLBA'),
          ('3000327709','GLBA/COO','GLBA'),
          ('3000316499','GLBA/DIR/CSS','GLBA'),
          ('3000317956','GSPR/RNA/PRJ/TRV/REF','GSPR'),
          ('3000329801','GSPR/FIN/HOL/FGX/195','GSPR'),
          ('3000319224','GSPR/RNA/PRJ/TRV/CGP','GSPR'),
          ('3000317961','GTPS/GFL/HSE/PJ1','GTPS'),
          ('3000319526','GTPS/GPS/GFL/FDF/ITF','GTPS'),
          ('3000319728','GTPS/TEC/ACT/COM','GTPS'),
          ('3000327423','GTPS/TEC/PRE/RES/BSC','GTPS'),
          ('3000328738','GTPS/TEC/ACT/RES/BSC','GTPS'),
          ('3000338808_to_be_inactivated','RESG/BSC/FAE/GTP_to_be_inactivated','GTPS'),
          ('3000329111','GTPS/GPS/GFL/FDF/TEC','GTPS'),
          ('3000319477','RESG/CFT/FAE/GTP/CGA','GTPS'),
          ('3000327538','GTPS/TRA/TRF/TTB','GTPS'),
          ('3000329064','GTPS/BAN/DIR','GTPS'),
          ('3000316967','GTPS/PCM/SOL/DCS/PRJ ','GTPS'),
          ('3000316983','GTPS/GFL/HSE/ITS','GTPS'),
          ('3000319521','GTPS/COO/PDA/SIC','GTPS'),
          ('3000329168','GTPS/BAN/ISB','GTPS'),
          ('3000327663','GTPS/PCM/SOL/RFM/PRJ','GTPS'),
          ('3000329897','GTPS/GFL/HSE/AH2','GTPS'),
          ('3000319315','GTPS/PCM/SOL/DCS/CCV','GTPS'),
          ('3000329441','GTPS/DIR/ISB','GTPS'),
          ('3000328571','HRCO/PRO/CDN ','HRCO'),
          ('3000387771','HRCO/IBF','HRCO'),
          ('3000319592','HRCO/SSA/EEC','HRCO'),
          ('3000327967','SOL/PTM/ RUN','HRCO'),
          ('3000316986','HRCO/PRO/DPR','HRCO'),
          ('3000317529','HRCO/PRO','HRCO'),
          ('3000319834','HRCO/DTS','HRCO'),
          ('3000328837','HRCO/SMF/APM/SOF','HRCO'),
          ('3000318449','HRCO/PRO/TRA/BUC','HRCO'),
          ('3000328509','HRCO/SMF/FOR/DPL','HRCO'),
          ('3000327440','HRCO/DIR','HRCO'),
          ('3000329652','HRCO/GBI ','HRCO'),
          ('3000316808','HRCO/PRO/CTA','HRCO'),
          ('3000326262','HRCO/SMF/MET/PPA','HRCO'),
          ('3000327395','HUMN/COO','HUMN'),
          ('3000327967_20200128','HUMN/DIR/DRH old','HUMN'),
          ('3000318807','IGAD/INS/DAT','IGAD'),
          ('3000329584','IGAD/COO','IGAD'),
          ('3000319684','IGAD/DIR/CTA','IGAD'),
          ('3000316905','ITIM/GER/CDN/DIG','ITIM'),
          ('3000319257','ITIM/GER/CDN/PPM','ITIM'),
          ('3000319764','ITIM/TRV/PRJ/TRF/SIO','ITIM'),
          ('3000319674','ITIM/TRV/PRJ/SEC/RBD','ITIM'),
          ('3000319507','ITIM/SIC/GSC/GRC/SYN','ITIM'),
          ('3000317519','ITIM/TRV/PRJ/TEC/RBD','ITIM'),
          ('3000319430','ITIM/GSI/SCP','ITIM'),
          ('3000328550','ITIM/PLT/COU','ITIM'),
          ('3000319509','ITIM/SIC/GSC/RIS/LIM','ITIM'),
          ('3000318550','ITIM/TRV/PRJ/SEC/VKI','ITIM'),
          ('3000319808','ITIM/GER/PAY/MPC/CAR','ITIM'),
          ('3000319043','ITIM/CSR/REF/VDF','ITIM'),
          ('3000319029','ITIM/CSR/TFE/VDF','ITIM'),
          ('3000319033','ITIM/PRF/DIR','ITIM'),
          ('3000327656','ITIM/GER/PRO/CSR/CRE ','ITIM'),
          ('3000329501','ITIM/CSR/MOP/VDF','ITIM'),
          ('3000318653','MACC/FIC/OLD','MACC'),
          ('3000318006','MACC/DIR','MACC'),
          ('3000388286','MARK/TEC/ACT/RES/BSC','MARK'),
          ('3000388287','MARK/TEC/PRE/RES/BSC','MARK'),
          ('3000327334','MARK/BTO/ORM/DIR','MARK'),
          ('3000319110','MARK/EBU','MARK'),
          ('3000329540','MARK/SLS/MKG/EUR','MARK'),
          ('3000328831','MCIB/DIR','MCIB'),
          ('3000324000','No Internal Billing','NA'),
          ('3000326536','PRIV/MON','PRIV'),
          ('3000380217','PRIV/TEC/ACT/RES/DDS','PRIV'),
          ('3000380218','PRIV/TEC/PRE/RES/DDS','PRIV'),
          ('3000326836','PRIV/HQE/MSD/MKG','PRIV'),
          ('3000326298','PRIV/HQE/DIR','PRIV'),
          ('3000326483','RESG/ACH/DEF','RESG/ACH'),
          ('3000317966','RESG/ACH/CTA','RESG/ACH'),
          ('3000326835','RESG/BSC/FAE/WAA/BEL','RESG/BSC'),
          ('3000328860','RESG/BSC/DCO/ODS/JIV','RESG/BSC'),
          ('3000328683','RESG/BSC/DCO/ODS/LIF','RESG/BSC'),
          ('3000328814','RESG/BSC/H2R/ODS/TOK','RESG/BSC'),
          ('3000318266','RESG/DIR','RESG/DIR'),
          ('3000329273','RESG/GTS/SEC/SOC/VDF','RESG/GTS'),
          ('3000316276','RESG/GTS/DWS/CCU/VDF','RESG/GTS'),
          ('3000329496','RESG/GTS/EUS/PKI/CRY','RESG/GTS'),
          ('3000328275','RESG/GTS/IAS/CTS/X86','RESG/GTS'),
          ('3000328060','RESG/GTS/TSI/GIS/INF','RESG/GTS'),
          ('3000327523','RESG/GTS/PLT/AST/VDF','RESG/GTS'),
          ('3000327559','RESG/GTS/DWS/DVS/NDG','RESG/GTS'),
          ('3000329619','RESG/GTS/DWS/USU/VDF','RESG/GTS'),
          ('3000316875','RESG/GTS/COO/DIR/VDF','RESG/GTS'),
          ('3000319614','RESG/GTS/ICR/ALD/VDF','RESG/GTS'),
          ('3000327920','RESG/IMM/SEG/ORD/MSI','RESG/IMM'),
          ('3000327859','RESG/IMM/DIR','RESG/IMM'),
          ('3000328250','RESG/IMM/SEG/DIR','RESG/IMM'),
          ('3000327715','RESG/IMM/T2I/NSI','RESG/IMM'),
          ('3000316458','RESG/IMM/CEN/RTF','RESG/IMM'),
          ('3000319179','RESG/IMM/FPM/SOR/OVF','RESG/IMM'),
          ('3000319610','RESG/TPS/API/CTA','RESG/TPS'),
          ('3000327760','RESG/TPS/GDO/CTA','RESG/TPS'),
          ('3000387576','RESG/DDS/FAT/TSV/DDS','RESG/TPS'),
          ('3000387579','RESG/TPS/ISR/RSW','RESG/TPS'),
          ('3000327344','RESG/TPS/API','RESG/TPS'),
          ('3000328341','RESG/TPS/ISR','RESG/TPS'),
          ('3000317930','RESG/TPS/ISR/CTA','RESG/TPS'),
          ('3000318322','RESG/TPS/GDO','RESG/TPS'),
          ('3000328864','RISQ/DTO','RISQ'),
          ('3000318403','RISQ/OPE','RISQ'),
          ('3000318922','RISQ/PRO/HSM','RISQ'),
          ('3000327378','RISQ/DIR/DIR','RISQ'),
          ('3000328493','RISQ/DIR/CTA','RISQ'),
          ('3000327870','SEGL/DSG','SEGL'),
          ('3000329867','SEGL/CAO/MAP','SEGL'),
          ('3000326878','SEGL/GER','SEGL'),
          ('3000328144','SEG/CAO/CTA','SEGL'),
          ('3000316377','SGSS/TND/CTA','SGSS'),
          ('3000328979','SGSS/SBO/FIL/PAR/DET','SGSS'),
          ('3000329267','SGSS/TEC/ACT/RES/BSC','SGSS'),
          ('3000329587','SGSS/TEC/PRE/RES/BSC','SGSS'),
          ('3000380219','SGSS/TEC/RES/DDS/AT','SGSS'),
          ('3000380220','SGSS/TEC/RES/DDS/PS','SGSS'),
          ('3000327712','SGSS/SBO/RET/NAN','SGSS'),
          ('3000329617','SGSS/DIR/TPO/PAR','SGSS'),
          ('3000318123','SGSS/CMS/DIR','SGSS'),
          ('3000319457','SGSS/SBO/CSI/PAR','SGSS'),
          ('3000317646','RESG/CFT/FAE/WAA/LYD','WAAM'),
          ('3000327462','RESG/CFT/FAE/WAA/EFF    ','WAAM'),
          ('3000387537','RESG/CFT/FAE/WAA/SIA    ','WAAM'),
          ('3000388303','WAAM/TEC/ACT/RES/BSC','WAAM'),
          ('3000388317','WAAM/TEC/PRE/RES/BSC','WAAM'),
          ('3000316802','WAAM/DIR','WAAM'),
          ('3000319485','RESG/CFT/FAE/WAA/BTL    ','WAAM'),
          ('3000329732','RESG/CFT/FAE/AME/NYC    ','AMER'),
          ('3000319567','RESG/CFT/FAE/ASI/CHI    ','ASIA'),
          ('3000328850','RESG/CFT/FAE/BDD/TTS    ','TRANSACTIS'),
          ('3000327685','RESG/DDS/FAT/TPS/GDO','RESG/DDS'),
          ('3000327725','RESG/DDS/FAT/TPS/API','RESG/DDS'),
          ('3000328741','RESG/DDS/FAT/TPS/ISR','RESG/DDS'),
          ('3000329887','RESG/DDS/DCS/ODS/SIG','RESG/DDS'),
          ('3000336251','RESG/DDS/FAT/TPS','RESG/DDS'),
          ('3000349370','RESG/DDS/FAT       ','RESG/DDS'),
          ('3000387626','RESG/DDS/FAT/TSV','RESG/DDS'),
          ('3000387627','RESG/DDS/FAT/TSV/CTA','RESG/DDS'),
          ('3000387628','RESG/DDS/FAT/TSV/TRF','RESG/DDS'),
          ('3000387629','RESG/DDS/FAT/TSV/SOC','RESG/DDS'),
          ('3000316837','RESG/DDS/ITF/ODS/AUT','RESG/DDS'),
          ('3000328687','RESG/DDS/DAT/ODS/OCR','RESG/DDS'),
          ('3000329694','RESG/DDS/DAT/VDF','RESG/DDS'),
          ('3000317858','RESG/DDS/DAT/ODS/QDO','RESG/DDS'),
          ('3000319196','RESG/DDS/DCS/ODS/DOC','RESG/DDS'),
          ('3000327963','RESG/DDS/ITF/ODS/DDD','RESG/DDS'),
          ('3000327484','RESG/DDS/DCS/ODS/SCA','RESG/DDS'),
          ('3000329331','RESG/DDS/ITF/ODS/ESM','RESG/DDS'),
          ('3000326982','RESG/DDS/DCS/ODS/MOS','RESG/DDS'),
          ('3000318928','RESG/DDS/DCS/ODS/CHA','RESG/DDS'),
          ('3000318351','RESG/DDS/DCS/ODS/PEG','RESG/DDS'),
          ('3000319274','RESG/CFT/FAT/TPS/ISR','RESG/CFT'),
          ('3000319288','RESG/CFT/FAT/TSV/SOC','RESG/CFT'),
          ('3000319601','RESG/CFT/H2R/ODS/LIF    ','RESG/CFT'),
          ('3000329205','RESG/CFT/FAT/TPS/API','RESG/CFT'),
          ('3000329566','RESG/CFT/FAT/TPS/GDO','RESG/CFT'),
          ('3000336252','RESG/CFT/FAT/TPS ','RESG/CFT'),
          ('3000337518','RESG/CFT/FAT/TSV','RESG/CFT'),
          ('3000387575','RESG/CFT/FAT/TSV/CFT  ','RESG/CFT'),
          ('3000329357','RESG/CFT/ITO/VDF','RESG/CFT'),
          ('3000318962','RESG/CFT/FAE/DFC/EBS','RESG/CFT'),
          ('3000328602','RESG/CFT/H2R/EUR/TSV','RESG/CFT'),
          ('3000319482','RESG/CFT/FAE/EUR/CGI','RESG/CFT'),
          ('3000319838','RESG/CFT/FAE/DFC/GSC','RESG/CFT'),
          ('3000328723','RESG/CFT/FAT/TSV/TRF','RESG/CFT'),
          ('3000319004','RESG/CFT/FAT/TSV','RESG/CFT'),
          ('3000329824','RESG/CFT/H2R/ODS/SIM','RESG/CFT'),
          ('3000326864','RESG/CFT/H2R/ODS/PLS','RESG/CFT'),
          ('3000318965','RESG/CFT/H2R/ODS/RIT','RESG/CFT'),
          ('3000319442','RESG/CFT/FAT/TSV/CTA','RESG/CFT'),
          ('3000327786','RESG/CFT/FAE/ASS/MOO','RESG/CFT'),
          ('3000377777','RESG/CFT/multipayeur','RESG/CFT');
        `)
      }

      public async down(queryRunner: QueryRunner): Promise<any> {
        return await queryRunner.dropTable(this.mappingTable, true);
      }

}