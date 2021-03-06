import { MigrationInterface, QueryRunner } from 'typeorm';

export class PyramidNewOrgasMapping1619622732252 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_organization`);
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_partner`);
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_payor`);
    await queryRunner.query(`
        INSERT INTO datalake_gpc_organization (datalakename, dpg)
        VALUES
        ('ARC/AEA','5555514907'),
        ('ARC/COO','5555571696'),
        ('ARC/DEA','5555571908'),
        ('ARC/DPR','5555571697'),
        ('ARC/FSK','5555571906'),
        ('ARC/S&C','5555571907'),
        ('ARC/TEA','5555514910'),
        ('ARS/ALM','5555514925'),
        ('ARS/AST','5555571693'),
        ('ARS/CAL','5555571916'),
        ('ARS/COO','5555571917'),
        ('ARS/CRP','5555571918'),
        ('ARS/CSD','5555571694'),
        ('ARS/MCR','5555571919'),
        ('ARS/OPE','5555514933'),
        ('ARS/PAM','5555571920'),
        ('COO/KMT','5555571698'),
        ('COO/MGX','5555514906'),
        ('COO/PRF','5555514901'),
        ('COO/TRF','5555514902'),
        ('CRL/AST','5555571699'),
        ('CRL/CDA','5555571914'),
        ('CRL/COO','5555514928'),
        ('CRL/CPL','5555571791'),
        ('CRL/IGA','5555571475'),
        ('CRL/PCT','5555571915'),
        ('CRL/ROC','5555514930'),
        ('CRL/SGL','5555571476'),
        ('DAT/AST','5555571909'),
        ('DAT/COO','5555514913'),
        ('DAT/DEC','5555571469'),
        ('DAT/DEX','5555514921'),
        ('DAT/INO','5555571910'),
        ('DAT/REFn','5555514914'),
        ('DAT/SOP','5555571911'),
        ('DAT/TPA','5555571912'),
        ('DIR/DIR','5555534108'),
        ('DSO/AST','5555571861'),
        ('DSO/COO','5555514938'),
        ('DSO/GSO','5555571863'),
        ('DSO/SEC','5555571866'),
        ('DSO/SRS','5555571865'),
        ('DSO/TAD','5555571864'),
        ('FIN/AST','5555571695'),
        ('FIN/COO','5555514922'),
        ('FIN/FDA','5555514923'),
        ('FIN/FPM','5555571558'),
        ('FIN/GTR','5555571913'),
        ('FIN/PAC','5555514924'),
        ('FIN/RSR','5555514927'),
        ('H2R/AST','5555571700'),
        ('H2R/COO','5555514934'),
        ('H2R/COP','5555514935'),
        ('H2R/ESM','5555514939'),
        ('H2R/ICA','5555514937'),
        ('H2R/RHC','5555571876'),
        ('H2R/RHG','5555514936'),
        ('H2R/RHP','5555571473'),
        ('EBS/ARC/AEA','5555514907'),
        ('EBS/ARC/COO','5555571696'),
        ('EBS/ARC/DEA','5555571908'),
        ('EBS/ARC/DPR','5555571697'),
        ('EBS/ARC/FSK','5555571906'),
        ('EBS/ARC/S&C','5555571907'),
        ('EBS/ARC/TEA','5555514910'),
        ('EBS/ARS/ALM','5555514925'),
        ('EBS/ARS/AST','5555571693'),
        ('EBS/ARS/CAL','5555571916'),
        ('EBS/ARS/COO','5555571917'),
        ('EBS/ARS/CRP','5555571918'),
        ('EBS/ARS/CSD','5555571694'),
        ('EBS/ARS/MCR','5555571919'),
        ('EBS/ARS/OPE','5555514933'),
        ('EBS/ARS/PAM','5555571920'),
        ('EBS/COO/KMT','5555571698'),
        ('EBS/COO/MGX','5555514906'),
        ('EBS/COO/PRF','5555514901'),
        ('EBS/COO/TRF','5555514902'),
        ('EBS/CRL/AST','5555571699'),
        ('EBS/CRL/CDA','5555571914'),
        ('EBS/CRL/COO','5555514928'),
        ('EBS/CRL/CPL','5555571791'),
        ('EBS/CRL/IGA','5555571475'),
        ('EBS/CRL/PCT','5555571915'),
        ('EBS/CRL/ROC','5555514930'),
        ('EBS/CRL/SGL','5555571476'),
        ('EBS/DAT/AST','5555571909'),
        ('EBS/DAT/COO','5555514913'),
        ('EBS/DAT/DEC','5555571469'),
        ('EBS/DAT/DEX','5555514921'),
        ('EBS/DAT/INO','5555571910'),
        ('EBS/DAT/REFn','5555514914'),
        ('EBS/DAT/SOP','5555571911'),
        ('EBS/DAT/TPA','5555571912'),
        ('EBS/DIR/DIR','5555534108'),
        ('EBS/DSO/AST','5555571861'),
        ('EBS/DSO/COO','5555514938'),
        ('EBS/DSO/GSO','5555571863'),
        ('EBS/DSO/SEC','5555571866'),
        ('EBS/DSO/SRS','5555571865'),
        ('EBS/DSO/TAD','5555571864'),
        ('EBS/FIN/AST','5555571695'),
        ('EBS/FIN/COO','5555514922'),
        ('EBS/FIN/FDA','5555514923'),
        ('EBS/FIN/FPM','5555571558'),
        ('EBS/FIN/GTR','5555571913'),
        ('EBS/FIN/PAC','5555514924'),
        ('EBS/FIN/RSR','5555514927'),
        ('EBS/H2R/AST','5555571700'),
        ('EBS/H2R/COO','5555514934'),
        ('EBS/H2R/COP','5555514935'),
        ('EBS/H2R/ESM','5555514939'),
        ('EBS/H2R/ICA','5555514937'),
        ('EBS/H2R/RHC','5555571876'),
        ('EBS/H2R/RHG','5555514936'),
        ('EBS/H2R/RHP','5555571473'),
        ('GSC/ARC/AEA','5555514907'),
        ('GSC/ARC/COO','5555571696'),
        ('GSC/ARC/DEA','5555571908'),
        ('GSC/ARC/DPR','5555571697'),
        ('GSC/ARC/FSK','5555571906'),
        ('GSC/ARC/S&C','5555571907'),
        ('GSC/ARC/TEA','5555514910'),
        ('GSC/ARS/ALM','5555514925'),
        ('GSC/ARS/AST','5555571693'),
        ('GSC/ARS/CAL','5555571916'),
        ('GSC/ARS/COO','5555571917'),
        ('GSC/ARS/CRP','5555571918'),
        ('GSC/ARS/CSD','5555571694'),
        ('GSC/ARS/MCR','5555571919'),
        ('GSC/ARS/OPE','5555514933'),
        ('GSC/ARS/PAM','5555571920'),
        ('GSC/COO/KMT','5555571698'),
        ('GSC/COO/MGX','5555514906'),
        ('GSC/COO/PRF','5555514901'),
        ('GSC/COO/TRF','5555514902'),
        ('GSC/CRL/AST','5555571699'),
        ('GSC/CRL/CDA','5555571914'),
        ('GSC/CRL/COO','5555514928'),
        ('GSC/CRL/CPL','5555571791'),
        ('GSC/CRL/IGA','5555571475'),
        ('GSC/CRL/PCT','5555571915'),
        ('GSC/CRL/ROC','5555514930'),
        ('GSC/CRL/SGL','5555571476'),
        ('GSC/DAT/AST','5555571909'),
        ('GSC/DAT/COO','5555514913'),
        ('GSC/DAT/DEC','5555571469'),
        ('GSC/DAT/DEX','5555514921'),
        ('GSC/DAT/INO','5555571910'),
        ('GSC/DAT/REFn','5555514914'),
        ('GSC/DAT/SOP','5555571911'),
        ('GSC/DAT/TPA','5555571912'),
        ('GSC/DIR/DIR','5555534108'),
        ('GSC/DSO/AST','5555571861'),
        ('GSC/DSO/COO','5555514938'),
        ('GSC/DSO/GSO','5555571863'),
        ('GSC/DSO/SEC','5555571866'),
        ('GSC/DSO/SRS','5555571865'),
        ('GSC/DSO/TAD','5555571864'),
        ('GSC/FIN/AST','5555571695'),
        ('GSC/FIN/COO','5555514922'),
        ('GSC/FIN/FDA','5555514923'),
        ('GSC/FIN/FPM','5555571558'),
        ('GSC/FIN/GTR','5555571913'),
        ('GSC/FIN/PAC','5555514924'),
        ('GSC/FIN/RSR','5555514927'),
        ('GSC/H2R/AST','5555571700'),
        ('GSC/H2R/COO','5555514934'),
        ('GSC/H2R/COP','5555514935'),
        ('GSC/H2R/ESM','5555514939'),
        ('GSC/H2R/ICA','5555514937'),
        ('GSC/H2R/RHC','5555571876'),
        ('GSC/H2R/RHG','5555514936'),
        ('GSC/H2R/RHP','5555571473'),
        ('CFT/ARC/AEA','3000314907'),
        ('CFT/ARC/DEA','3000371908'),
        ('CFT/ARC/DPR','3000371697'),
        ('CFT/ARC/FSK','3000371906'),
        ('CFT/ARC/MGT','3000371696'),
        ('CFT/ARC/S&C','3000371907'),
        ('CFT/ARC/TEA','3000314910'),
        ('CFT/COO/ACI','3000371961'),
        ('CFT/COO/CCM','3000371960'),
        ('CFT/COO/CRM','3000371963'),
        ('CFT/COO/KMT','3000371698'),
        ('CFT/COO/MGT','3000371959'),
        ('CFT/COO/MGX','3000314906'),
        ('CFT/COO/OFS','3000314901'),
        ('CFT/COO/REM','3000371962'),
        ('CFT/COO/TSS','3000314902'),
        ('CFT/CRL/AST','3000371699'),
        ('CFT/CRL/CDA','3000371914'),
        ('CFT/CRL/CPL','3000371791'),
        ('CFT/CRL/IGA','3000371475'),
        ('CFT/CRL/MGT','3000314928'),
        ('CFT/CRL/PCT','3000371915'),
        ('CFT/CRL/ROC','3000314930'),
        ('CFT/CRL/SGL','3000371476'),
        ('CFT/FIN/AST','3000371695'),
        ('CFT/FIN/FDA','3000314923'),
        ('CFT/FIN/FPM','3000371558'),
        ('CFT/FIN/MGT','3000314922'),
        ('CFT/FIN/PAC','3000314924'),
        ('CFT/FIN/RSR','3000314927'),
        ('CFT/H2R/AST','3000371700'),
        ('CFT/H2R/COP','3000314935'),
        ('CFT/H2R/ICA','3000314937'),
        ('CFT/H2R/MGT','3000314934'),
        ('CFT/H2R/RHC','3000371876'),
        ('CFT/H2R/RHG','3000314936'),
        ('CFT/H2R/RHP','3000371473'),
        ('CFT/ITO/INO','3000371910'),
        ('CFT/ITO/MGT','3000314938'),
        ('CFT/ITO/OPM','3000371865'),
        ('CFT/ITO/TED','3000371864'),
        ('CFT/MGT/GSC','3000327491'),
        ('CFT/MGT/MGT','3000371976'),
        ('CFT/SCR/AST','3000371693'),
        ('CFT/SCR/CAL','3000371916'),
        ('CFT/SCR/CRP','3000371918'),
        ('CFT/SCR/CSD','3000371694'),
        ('CFT/SCR/MCR','3000371919'),
        ('CFT/SCR/MGT','3000371917'),
        ('CFT/SCR/OPE','3000314933'),
        ('CFT/SCR/PAM','3000371920'),
        ('CFT/SEC/ASM','3000371972'),
        ('CFT/SEC/AVM','3000371971'),
        ('CFT/SEC/FSM','3000371975'),
        ('CFT/SEC/GCS','3000371969'),
        ('CFT/SEC/IRT','3000371974'),
        ('CFT/SEC/MGT','3000371866'),
        ('CFT/SEC/ORM','3000371970'),
        ('CFT/SEC/PRJ','3000371973'),
        ('CFT/TSR/ALM','3000314925'),
        ('CFT/TSR/AST','3000371966'),
        ('CFT/TSR/LRM','3000371967'),
        ('CFT/TSR/MGT','3000371964'),
        ('CFT/TSR/OPE','3000371965'),
        ('CFT/TSR/SRT','3000371968'),
        ('CFT/TSR/T&F','3000371913'),
        ('DDS/ARC/ARC','3000371909'),
        ('DDS/ARC/MGT','3000371999'),
        ('DDS/DAT/BCS','3000371911'),
        ('DDS/DAT/BDX','3000371978'),
        ('DDS/DAT/CSA','3000371977'),
        ('DDS/DAT/DMS','3000371469'),
        ('DDS/DAT/MGT','3000314913'),
        ('DDS/DCS/ASO','3000371981'),
        ('DDS/DCS/BPM','3000371982'),
        ('DDS/DCS/EDM','3000371983'),
        ('DDS/DCS/IDC','3000371984'),
        ('DDS/DCS/KCS','3000371985'),
        ('DDS/DCS/MGT','3000371980'),
        ('DDS/DCS/SMA','3000371986'),
        ('DDS/GSO/GSO','3000371993'),
        ('DDS/GSO/MGT','3000371992'),
        ('DDS/ITF/DSP','3000371991'),
        ('DDS/ITF/E&E','3000314921'),
        ('DDS/ITF/ESM','3000314939'),
        ('DDS/ITF/IAM','3000371990'),
        ('DDS/ITF/MGT','3000371989'),
        ('DDS/MGT/GSC','3000387598'),
        ('DDS/MGT/MGT','3000371994'),
        ('DDS/REF/MGT','3000371979'),
        ('DDS/REF/RDM','3000314914'),
        ('DDS/REF/TDM','3000371912'),
        ('EBS/CFT/ARC/AEA','3000314907'),
        ('EBS/CFT/ARC/DEA','3000371908'),
        ('EBS/CFT/ARC/DPR','3000371697'),
        ('EBS/CFT/ARC/FSK','3000371906'),
        ('EBS/CFT/ARC/MGT','3000371696'),
        ('EBS/CFT/ARC/S&C','3000371907'),
        ('EBS/CFT/ARC/TEA','3000314910'),
        ('EBS/CFT/COO/ACI','3000371961'),
        ('EBS/CFT/COO/CCM','3000371960'),
        ('EBS/CFT/COO/CRM','3000371963'),
        ('EBS/CFT/COO/KMT','3000371698'),
        ('EBS/CFT/COO/MGT','3000371959'),
        ('EBS/CFT/COO/MGX','3000314906'),
        ('EBS/CFT/COO/OFS','3000314901'),
        ('EBS/CFT/COO/REM','3000371962'),
        ('EBS/CFT/COO/TSS','3000314902'),
        ('EBS/CFT/CRL/AST','3000371699'),
        ('EBS/CFT/CRL/CDA','3000371914'),
        ('EBS/CFT/CRL/CPL','3000371791'),
        ('EBS/CFT/CRL/IGA','3000371475'),
        ('EBS/CFT/CRL/MGT','3000314928'),
        ('EBS/CFT/CRL/PCT','3000371915'),
        ('EBS/CFT/CRL/ROC','3000314930'),
        ('EBS/CFT/CRL/SGL','3000371476'),
        ('EBS/CFT/FIN/AST','3000371695'),
        ('EBS/CFT/FIN/FDA','3000314923'),
        ('EBS/CFT/FIN/FPM','3000371558'),
        ('EBS/CFT/FIN/MGT','3000314922'),
        ('EBS/CFT/FIN/PAC','3000314924'),
        ('EBS/CFT/FIN/RSR','3000314927'),
        ('EBS/CFT/H2R/AST','3000371700'),
        ('EBS/CFT/H2R/COP','3000314935'),
        ('EBS/CFT/H2R/ICA','3000314937'),
        ('EBS/CFT/H2R/MGT','3000314934'),
        ('EBS/CFT/H2R/RHC','3000371876'),
        ('EBS/CFT/H2R/RHG','3000314936'),
        ('EBS/CFT/H2R/RHP','3000371473'),
        ('EBS/CFT/ITO/INO','3000371910'),
        ('EBS/CFT/ITO/MGT','3000314938'),
        ('EBS/CFT/ITO/OPM','3000371865'),
        ('EBS/CFT/ITO/TED','3000371864'),
        ('EBS/CFT/MGT/GSC','3000327491'),
        ('EBS/CFT/MGT/MGT','3000371976'),
        ('EBS/CFT/SCR/AST','3000371693'),
        ('EBS/CFT/SCR/CAL','3000371916'),
        ('EBS/CFT/SCR/CRP','3000371918'),
        ('EBS/CFT/SCR/CSD','3000371694'),
        ('EBS/CFT/SCR/MCR','3000371919'),
        ('EBS/CFT/SCR/MGT','3000371917'),
        ('EBS/CFT/SCR/OPE','3000314933'),
        ('EBS/CFT/SCR/PAM','3000371920'),
        ('EBS/CFT/SEC/ASM','3000371972'),
        ('EBS/CFT/SEC/AVM','3000371971'),
        ('EBS/CFT/SEC/FSM','3000371975'),
        ('EBS/CFT/SEC/GCS','3000371969'),
        ('EBS/CFT/SEC/IRT','3000371974'),
        ('EBS/CFT/SEC/MGT','3000371866'),
        ('EBS/CFT/SEC/ORM','3000371970'),
        ('EBS/CFT/SEC/PRJ','3000371973'),
        ('EBS/CFT/TSR/ALM','3000314925'),
        ('EBS/CFT/TSR/AST','3000371966'),
        ('EBS/CFT/TSR/LRM','3000371967'),
        ('EBS/CFT/TSR/MGT','3000371964'),
        ('EBS/CFT/TSR/OPE','3000371965'),
        ('EBS/CFT/TSR/SRT','3000371968'),
        ('EBS/CFT/TSR/T&F','3000371913'),
        ('EBS/DDS/ARC/ARC','3000371909'),
        ('EBS/DDS/ARC/MGT','3000371999'),
        ('EBS/DDS/DAT/BCS','3000371911'),
        ('EBS/DDS/DAT/BDX','3000371978'),
        ('EBS/DDS/DAT/CSA','3000371977'),
        ('EBS/DDS/DAT/DMS','3000371469'),
        ('EBS/DDS/DAT/MGT','3000314913'),
        ('EBS/DDS/DCS/ASO','3000371981'),
        ('EBS/DDS/DCS/BPM','3000371982'),
        ('EBS/DDS/DCS/EDM','3000371983'),
        ('EBS/DDS/DCS/IDC','3000371984'),
        ('EBS/DDS/DCS/KCS','3000371985'),
        ('EBS/DDS/DCS/MGT','3000371980'),
        ('EBS/DDS/DCS/SMA','3000371986'),
        ('EBS/DDS/GSO/GSO','3000371993'),
        ('EBS/DDS/GSO/MGT','3000371992'),
        ('EBS/DDS/ITF/DSP','3000371991'),
        ('EBS/DDS/ITF/E&E','3000314921'),
        ('EBS/DDS/ITF/ESM','3000314939'),
        ('EBS/DDS/ITF/IAM','3000371990'),
        ('EBS/DDS/ITF/MGT','3000371989'),
        ('EBS/DDS/MGT/GSC','3000387598'),
        ('EBS/DDS/MGT/MGT','3000371994'),
        ('EBS/DDS/REF/MGT','3000371979'),
        ('EBS/DDS/REF/RDM','3000314914'),
        ('EBS/DDS/REF/TDM','3000371912'),
        ('GSC/CFT/ARC/AEA','3000314907'),
        ('GSC/CFT/ARC/DEA','3000371908'),
        ('GSC/CFT/ARC/DPR','3000371697'),
        ('GSC/CFT/ARC/FSK','3000371906'),
        ('GSC/CFT/ARC/MGT','3000371696'),
        ('GSC/CFT/ARC/S&C','3000371907'),
        ('GSC/CFT/ARC/TEA','3000314910'),
        ('GSC/CFT/COO/ACI','3000371961'),
        ('GSC/CFT/COO/CCM','3000371960'),
        ('GSC/CFT/COO/CRM','3000371963'),
        ('GSC/CFT/COO/KMT','3000371698'),
        ('GSC/CFT/COO/MGT','3000371959'),
        ('GSC/CFT/COO/MGX','3000314906'),
        ('GSC/CFT/COO/OFS','3000314901'),
        ('GSC/CFT/COO/REM','3000371962'),
        ('GSC/CFT/COO/TSS','3000314902'),
        ('GSC/CFT/CRL/AST','3000371699'),
        ('GSC/CFT/CRL/CDA','3000371914'),
        ('GSC/CFT/CRL/CPL','3000371791'),
        ('GSC/CFT/CRL/IGA','3000371475'),
        ('GSC/CFT/CRL/MGT','3000314928'),
        ('GSC/CFT/CRL/PCT','3000371915'),
        ('GSC/CFT/CRL/ROC','3000314930'),
        ('GSC/CFT/CRL/SGL','3000371476'),
        ('GSC/CFT/FIN/AST','3000371695'),
        ('GSC/CFT/FIN/FDA','3000314923'),
        ('GSC/CFT/FIN/FPM','3000371558'),
        ('GSC/CFT/FIN/MGT','3000314922'),
        ('GSC/CFT/FIN/PAC','3000314924'),
        ('GSC/CFT/FIN/RSR','3000314927'),
        ('GSC/CFT/H2R/AST','3000371700'),
        ('GSC/CFT/H2R/COP','3000314935'),
        ('GSC/CFT/H2R/ICA','3000314937'),
        ('GSC/CFT/H2R/MGT','3000314934'),
        ('GSC/CFT/H2R/RHC','3000371876'),
        ('GSC/CFT/H2R/RHG','3000314936'),
        ('GSC/CFT/H2R/RHP','3000371473'),
        ('GSC/CFT/ITO/INO','3000371910'),
        ('GSC/CFT/ITO/MGT','3000314938'),
        ('GSC/CFT/ITO/OPM','3000371865'),
        ('GSC/CFT/ITO/TED','3000371864'),
        ('GSC/CFT/MGT/GSC','3000327491'),
        ('GSC/CFT/MGT/MGT','3000371976'),
        ('GSC/CFT/SCR/AST','3000371693'),
        ('GSC/CFT/SCR/CAL','3000371916'),
        ('GSC/CFT/SCR/CRP','3000371918'),
        ('GSC/CFT/SCR/CSD','3000371694'),
        ('GSC/CFT/SCR/MCR','3000371919'),
        ('GSC/CFT/SCR/MGT','3000371917'),
        ('GSC/CFT/SCR/OPE','3000314933'),
        ('GSC/CFT/SCR/PAM','3000371920'),
        ('GSC/CFT/SEC/ASM','3000371972'),
        ('GSC/CFT/SEC/AVM','3000371971'),
        ('GSC/CFT/SEC/FSM','3000371975'),
        ('GSC/CFT/SEC/GCS','3000371969'),
        ('GSC/CFT/SEC/IRT','3000371974'),
        ('GSC/CFT/SEC/MGT','3000371866'),
        ('GSC/CFT/SEC/ORM','3000371970'),
        ('GSC/CFT/SEC/PRJ','3000371973'),
        ('GSC/CFT/TSR/ALM','3000314925'),
        ('GSC/CFT/TSR/AST','3000371966'),
        ('GSC/CFT/TSR/LRM','3000371967'),
        ('GSC/CFT/TSR/MGT','3000371964'),
        ('GSC/CFT/TSR/OPE','3000371965'),
        ('GSC/CFT/TSR/SRT','3000371968'),
        ('GSC/CFT/TSR/T&F','3000371913'),
        ('GSC/DDS/ARC/ARC','3000371909'),
        ('GSC/DDS/ARC/MGT','3000371999'),
        ('GSC/DDS/DAT/BCS','3000371911'),
        ('GSC/DDS/DAT/BDX','3000371978'),
        ('GSC/DDS/DAT/CSA','3000371977'),
        ('GSC/DDS/DAT/DMS','3000371469'),
        ('GSC/DDS/DAT/MGT','3000314913'),
        ('GSC/DDS/DCS/ASO','3000371981'),
        ('GSC/DDS/DCS/BPM','3000371982'),
        ('GSC/DDS/DCS/EDM','3000371983'),
        ('GSC/DDS/DCS/IDC','3000371984'),
        ('GSC/DDS/DCS/KCS','3000371985'),
        ('GSC/DDS/DCS/MGT','3000371980'),
        ('GSC/DDS/DCS/SMA','3000371986'),
        ('GSC/DDS/GSO/GSO','3000371993'),
        ('GSC/DDS/GSO/MGT','3000371992'),
        ('GSC/DDS/ITF/DSP','3000371991'),
        ('GSC/DDS/ITF/E&E','3000314921'),
        ('GSC/DDS/ITF/ESM','3000314939'),
        ('GSC/DDS/ITF/IAM','3000371990'),
        ('GSC/DDS/ITF/MGT','3000371989'),
        ('GSC/DDS/MGT/GSC','3000387598'),
        ('GSC/DDS/MGT/MGT','3000371994'),
        ('GSC/DDS/REF/MGT','3000371979'),
        ('GSC/DDS/REF/RDM','3000314914'),
        ('GSC/DDS/REF/TDM','3000371912');
        `);
    await queryRunner.query(`
        INSERT INTO datalake_gpc_partner (datalakename, gpcname)
        VALUES
        ('AFMO','AFMO_BSC'),
        ('ALDA','ALDA'),
        ('AMER','AMER'),
        ('ASSU','ASSU_BSC'),
        ('BDDF','BDDF'),
        ('CDN','CDN'),
        ('COMM','COMM'),
        ('CPLE','CPLE'),
        ('DFIN','DFIN'),
        ('DGLE','DGLE'),
        ('EURO','EURO_BSC'),
        ('FRF','FRF'),
        ('GBSU','GBSU'),
        ('GLBA','GLBA'),
        ('GSPR','GSPR'),
        ('GTPS','GTPS'),
        ('HRCO','HRCO'),
        ('IGAD','IGAD'),
        ('IRBS','AFMO_BSC'),
        ('ITIM','ITIM'),
        ('MARK','MARK'),
        ('NB25','NB25'),
        ('RESG/ACH','RESG/ACH'),
        ('RESG/DIR','RESG/DIR'),
        ('RESG_GSC','RESG_GSC'),
        ('RESG/GTS','RESG/GTS'),
        ('RESG/IMM','RESG/IMM'),
        ('RESG/SGC','RESG/SGC'),
        ('RESG/TPS','RESG/TPS'),
        ('RISQ','RISQ'),
        ('RUSS','RUSS_BSC'),
        ('SEGL','SEGL'),
        ('SGEF','SGEF_BSC'),
        ('SGSS','SGSS'),
        ('TRANSACTIS','TRS'),
        ('WAAM','WAAM'),
        ('Multi','Multi');
        `);
    await queryRunner.query(`
        INSERT INTO datalake_gpc_payor (payorname, gpcpartnername)
        VALUES
        ('RESG/CFT/FAT/TSV','CFT_AC'),
        ('RESG/CFT/FAT/TSV/SOC','CFT_SOC'),
        ('RESG/DDS/ITF/ODS/ESM','DDS_OdS'),
        ('RESG/DDS/DCS/ODS/SCA','DDS_OdS'),
        ('RESG/CFT/H2R/ODS/PLS','CFT_OdS'),
        ('RESG/DDS/DCS/ODS/SIG','DDS_OdS'),
        ('RESG/DDS/DAT/ODS/QDO','DDS_OdS'),
        ('RESG/DDS/DCS/ODS/MOS','DDS_OdS'),
        ('RESG/DDS/DCS/ODS/PEG','DDS_OdS'),
        ('RESG/DDS/ITF/ODS/DDD','DDS_OdS'),
        ('RESG/DDS/DCS/ODS/DOC','DDS_OdS'),
        ('RESG/DDS/ITF/ODS/AUT','DDS_OdS'),
        ('RESG/DDS/DCS/ODS/CHA','DDS_OdS'),
        ('RESG/CFT/H2R/ODS/RIT','CFT_OdS'),
        ('RESG/CFT/H2R/ODS/SIM','CFT_OdS'),
        ('RESG/CFT/multipayeur','Multi'),
        ('RESG/CFT/FAE/DFC/GSC','RESG_GSC'),
        ('RESG/CFT/H2R/ODS/LIF','CFT_OdS'),
        ('RESG/DDS/DAT/ODS/OCR','DDS_OdS'),
        ('RESG/CFT/FAT/TSV/TRF','CFT_TRA'),
        ('RESG/CFT/FAE/DFC/EBS','RESG_EBS'),
        ('RESG/DDS/FAT/TSV/SOC','DDS_SOC'),
        ('RESG/DDS/FAT/TSV','DDS_AC'),
        ('RESG/DDS/FAT/TSV/DDS','GSPR'),
        ('RESG/CFT/FAT/TSV/CTA','GSPR'),
        ('RESG/CFT/FAE/ASS/MOO','ASSU_BSC'),
        ('RESG/CFT/FAT/TSV/CFT','GSPR'),
        ('RESG/DDS/FAT/TSV/CTA','GSPR'),
        ('RESG/DDS/FAT/TSV/TRF','DDS_TRA'),
        ('RESG/BSC/DCO/ODS/LIF','CFT_OdS');
        `);
  }
  public async down(queryRunner: QueryRunner): Promise<any> {
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_organization`);
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_partner`);
    await queryRunner.query(`TRUNCATE TABLE datalake_gpc_payor`);
    await queryRunner.query(`
        INSERT INTO datalake_gpc_organization (datalakename, dpg)
        VALUES
        ('ARC/AEA','3000314907'),
        ('ARC/DEA','3000371908'),
        ('ARC/DPR','3000371697'),
        ('ARC/FSK','3000371906'),
        ('ARC/MGT','3000371696'),
        ('ARC/S&C','3000371907'),
        ('ARC/TEA','3000314910'),
        ('COO/ACI','3000371961'),
        ('COO/CCM','3000371960'),
        ('COO/CRM','3000371963'),
        ('COO/KMT','3000371698'),
        ('COO/MGT','3000371959'),
        ('COO/MGX','3000314906'),
        ('COO/OFS','3000314901'),
        ('COO/REM','3000371962'),
        ('COO/TSS','3000314902'),
        ('CRL/AST','3000371699'),
        ('CRL/CDA','3000371914'),
        ('CRL/CPL','3000371791'),
        ('CRL/IGA','3000371475'),
        ('CRL/MGT','3000314928'),
        ('CRL/PCT','3000371915'),
        ('CRL/ROC','3000314930'),
        ('CRL/SGL','3000371476'),
        ('FIN/AST','3000371695'),
        ('FIN/FDA','3000314923'),
        ('FIN/FPM','3000371558'),
        ('FIN/MGT','3000314922'),
        ('FIN/PAC','3000314924'),
        ('FIN/RSR','3000314927'),
        ('H2R/AST','3000371700'),
        ('H2R/COP','3000314935'),
        ('H2R/ICA','3000314937'),
        ('H2R/MGT','3000314934'),
        ('H2R/RHC','3000371876'),
        ('H2R/RHG','3000314936'),
        ('H2R/RHP','3000371473'),
        ('ITO/INO','3000371910'),
        ('ITO/MGT','3000314938'),
        ('ITO/OPM','3000371865'),
        ('ITO/TED','3000371864'),
        ('MGT/GSC','3000327491'),
        ('MGT/MGT','3000371976'),
        ('SCR/AST','3000371693'),
        ('SCR/CAL','3000371916'),
        ('SCR/CRP','3000371918'),
        ('SCR/CSD','3000371694'),
        ('SCR/MCR','3000371919'),
        ('SCR/MGT','3000371917'),
        ('SCR/OPE','3000314933'),
        ('SCR/PAM','3000371920'),
        ('SEC/ASM','3000371972'),
        ('SEC/AVM','3000371971'),
        ('SEC/FSM','3000371975'),
        ('SEC/GCS','3000371969'),
        ('SEC/IRT','3000371974'),
        ('SEC/MGT','3000371866'),
        ('SEC/ORM','3000371970'),
        ('SEC/PRJ','3000371973'),
        ('TSR/ALM','3000314925'),
        ('TSR/AST','3000371966'),
        ('TSR/LRM','3000371967'),
        ('TSR/MGT','3000371964'),
        ('TSR/OPE','3000371965'),
        ('TSR/SRT','3000371968'),
        ('TSR/T&F','3000371913'),
        ('ARC/ARC','3000371909'),
        ('ARC/MGT','3000371999'),
        ('DAT/BCS','3000371911'),
        ('DAT/BDX','3000371978'),
        ('DAT/CSA','3000371977'),
        ('DAT/DMS','3000371469'),
        ('DAT/MGT','3000314913'),
        ('DCS/ASO','3000371981'),
        ('DCS/BPM','3000371982'),
        ('DCS/EDM','3000371983'),
        ('DCS/IDC','3000371984'),
        ('DCS/KCS','3000371985'),
        ('DCS/MGT','3000371980'),
        ('DCS/SMA','3000371986'),
        ('GSO/GSO','3000371993'),
        ('GSO/MGT','3000371992'),
        ('ITF/DSP','3000371991'),
        ('ITF/E&E','3000314921'),
        ('ITF/ESM','3000314939'),
        ('ITF/IAM','3000371990'),
        ('ITF/MGT','3000371989'),
        ('MGT/GSC','3000387598'),
        ('MGT/MGT','3000371994'),
        ('REF/MGT','3000371979'),
        ('REF/RDM','3000314914'),
        ('REF/TDM','3000371912'),
        ('EBS/ARC/AEA','3000314907'),
        ('EBS/ARC/DEA','3000371908'),
        ('EBS/ARC/DPR','3000371697'),
        ('EBS/ARC/FSK','3000371906'),
        ('EBS/ARC/MGT','3000371696'),
        ('EBS/ARC/S&C','3000371907'),
        ('EBS/ARC/TEA','3000314910'),
        ('EBS/COO/ACI','3000371961'),
        ('EBS/COO/CCM','3000371960'),
        ('EBS/COO/CRM','3000371963'),
        ('EBS/COO/KMT','3000371698'),
        ('EBS/COO/MGT','3000371959'),
        ('EBS/COO/MGX','3000314906'),
        ('EBS/COO/OFS','3000314901'),
        ('EBS/COO/REM','3000371962'),
        ('EBS/COO/TSS','3000314902'),
        ('EBS/CRL/AST','3000371699'),
        ('EBS/CRL/CDA','3000371914'),
        ('EBS/CRL/CPL','3000371791'),
        ('EBS/CRL/IGA','3000371475'),
        ('EBS/CRL/MGT','3000314928'),
        ('EBS/CRL/PCT','3000371915'),
        ('EBS/CRL/ROC','3000314930'),
        ('EBS/CRL/SGL','3000371476'),
        ('EBS/FIN/AST','3000371695'),
        ('EBS/FIN/FDA','3000314923'),
        ('EBS/FIN/FPM','3000371558'),
        ('EBS/FIN/MGT','3000314922'),
        ('EBS/FIN/PAC','3000314924'),
        ('EBS/FIN/RSR','3000314927'),
        ('EBS/H2R/AST','3000371700'),
        ('EBS/H2R/COP','3000314935'),
        ('EBS/H2R/ICA','3000314937'),
        ('EBS/H2R/MGT','3000314934'),
        ('EBS/H2R/RHC','3000371876'),
        ('EBS/H2R/RHG','3000314936'),
        ('EBS/H2R/RHP','3000371473'),
        ('EBS/ITO/INO','3000371910'),
        ('EBS/ITO/MGT','3000314938'),
        ('EBS/ITO/OPM','3000371865'),
        ('EBS/ITO/TED','3000371864'),
        ('EBS/MGT/GSC','3000327491'),
        ('EBS/MGT/MGT','3000371976'),
        ('EBS/SCR/AST','3000371693'),
        ('EBS/SCR/CAL','3000371916'),
        ('EBS/SCR/CRP','3000371918'),
        ('EBS/SCR/CSD','3000371694'),
        ('EBS/SCR/MCR','3000371919'),
        ('EBS/SCR/MGT','3000371917'),
        ('EBS/SCR/OPE','3000314933'),
        ('EBS/SCR/PAM','3000371920'),
        ('EBS/SEC/ASM','3000371972'),
        ('EBS/SEC/AVM','3000371971'),
        ('EBS/SEC/FSM','3000371975'),
        ('EBS/SEC/GCS','3000371969'),
        ('EBS/SEC/IRT','3000371974'),
        ('EBS/SEC/MGT','3000371866'),
        ('EBS/SEC/ORM','3000371970'),
        ('EBS/SEC/PRJ','3000371973'),
        ('EBS/TSR/ALM','3000314925'),
        ('EBS/TSR/AST','3000371966'),
        ('EBS/TSR/LRM','3000371967'),
        ('EBS/TSR/MGT','3000371964'),
        ('EBS/TSR/OPE','3000371965'),
        ('EBS/TSR/SRT','3000371968'),
        ('EBS/TSR/T&F','3000371913'),
        ('EBS/ARC/ARC','3000371909'),
        ('EBS/ARC/MGT','3000371999'),
        ('EBS/DAT/BCS','3000371911'),
        ('EBS/DAT/BDX','3000371978'),
        ('EBS/DAT/CSA','3000371977'),
        ('EBS/DAT/DMS','3000371469'),
        ('EBS/DAT/MGT','3000314913'),
        ('EBS/DCS/ASO','3000371981'),
        ('EBS/DCS/BPM','3000371982'),
        ('EBS/DCS/EDM','3000371983'),
        ('EBS/DCS/IDC','3000371984'),
        ('EBS/DCS/KCS','3000371985'),
        ('EBS/DCS/MGT','3000371980'),
        ('EBS/DCS/SMA','3000371986'),
        ('EBS/GSO/GSO','3000371993'),
        ('EBS/GSO/MGT','3000371992'),
        ('EBS/ITF/DSP','3000371991'),
        ('EBS/ITF/E&E','3000314921'),
        ('EBS/ITF/ESM','3000314939'),
        ('EBS/ITF/IAM','3000371990'),
        ('EBS/ITF/MGT','3000371989'),
        ('EBS/MGT/GSC','3000387598'),
        ('EBS/MGT/MGT','3000371994'),
        ('EBS/REF/MGT','3000371979'),
        ('EBS/REF/RDM','3000314914'),
        ('EBS/REF/TDM','3000371912'),
        ('GSC/ARC/AEA','3000314907'),
        ('GSC/ARC/DEA','3000371908'),
        ('GSC/ARC/DPR','3000371697'),
        ('GSC/ARC/FSK','3000371906'),
        ('GSC/ARC/MGT','3000371696'),
        ('GSC/ARC/S&C','3000371907'),
        ('GSC/ARC/TEA','3000314910'),
        ('GSC/COO/ACI','3000371961'),
        ('GSC/COO/CCM','3000371960'),
        ('GSC/COO/CRM','3000371963'),
        ('GSC/COO/KMT','3000371698'),
        ('GSC/COO/MGT','3000371959'),
        ('GSC/COO/MGX','3000314906'),
        ('GSC/COO/OFS','3000314901'),
        ('GSC/COO/REM','3000371962'),
        ('GSC/COO/TSS','3000314902'),
        ('GSC/CRL/AST','3000371699'),
        ('GSC/CRL/CDA','3000371914'),
        ('GSC/CRL/CPL','3000371791'),
        ('GSC/CRL/IGA','3000371475'),
        ('GSC/CRL/MGT','3000314928'),
        ('GSC/CRL/PCT','3000371915'),
        ('GSC/CRL/ROC','3000314930'),
        ('GSC/CRL/SGL','3000371476'),
        ('GSC/FIN/AST','3000371695'),
        ('GSC/FIN/FDA','3000314923'),
        ('GSC/FIN/FPM','3000371558'),
        ('GSC/FIN/MGT','3000314922'),
        ('GSC/FIN/PAC','3000314924'),
        ('GSC/FIN/RSR','3000314927'),
        ('GSC/H2R/AST','3000371700'),
        ('GSC/H2R/COP','3000314935'),
        ('GSC/H2R/ICA','3000314937'),
        ('GSC/H2R/MGT','3000314934'),
        ('GSC/H2R/RHC','3000371876'),
        ('GSC/H2R/RHG','3000314936'),
        ('GSC/H2R/RHP','3000371473'),
        ('GSC/ITO/INO','3000371910'),
        ('GSC/ITO/MGT','3000314938'),
        ('GSC/ITO/OPM','3000371865'),
        ('GSC/ITO/TED','3000371864'),
        ('GSC/MGT/GSC','3000327491'),
        ('GSC/MGT/MGT','3000371976'),
        ('GSC/SCR/AST','3000371693'),
        ('GSC/SCR/CAL','3000371916'),
        ('GSC/SCR/CRP','3000371918'),
        ('GSC/SCR/CSD','3000371694'),
        ('GSC/SCR/MCR','3000371919'),
        ('GSC/SCR/MGT','3000371917'),
        ('GSC/SCR/OPE','3000314933'),
        ('GSC/SCR/PAM','3000371920'),
        ('GSC/SEC/ASM','3000371972'),
        ('GSC/SEC/AVM','3000371971'),
        ('GSC/SEC/FSM','3000371975'),
        ('GSC/SEC/GCS','3000371969'),
        ('GSC/SEC/IRT','3000371974'),
        ('GSC/SEC/MGT','3000371866'),
        ('GSC/SEC/ORM','3000371970'),
        ('GSC/SEC/PRJ','3000371973'),
        ('GSC/TSR/ALM','3000314925'),
        ('GSC/TSR/AST','3000371966'),
        ('GSC/TSR/LRM','3000371967'),
        ('GSC/TSR/MGT','3000371964'),
        ('GSC/TSR/OPE','3000371965'),
        ('GSC/TSR/SRT','3000371968'),
        ('GSC/TSR/T&F','3000371913'),
        ('GSC/ARC/ARC','3000371909'),
        ('GSC/ARC/MGT','3000371999'),
        ('GSC/DAT/BCS','3000371911'),
        ('GSC/DAT/BDX','3000371978'),
        ('GSC/DAT/CSA','3000371977'),
        ('GSC/DAT/DMS','3000371469'),
        ('GSC/DAT/MGT','3000314913'),
        ('GSC/DCS/ASO','3000371981'),
        ('GSC/DCS/BPM','3000371982'),
        ('GSC/DCS/EDM','3000371983'),
        ('GSC/DCS/IDC','3000371984'),
        ('GSC/DCS/KCS','3000371985'),
        ('GSC/DCS/MGT','3000371980'),
        ('GSC/DCS/SMA','3000371986'),
        ('GSC/GSO/GSO','3000371993'),
        ('GSC/GSO/MGT','3000371992'),
        ('GSC/ITF/DSP','3000371991'),
        ('GSC/ITF/E&E','3000314921'),
        ('GSC/ITF/ESM','3000314939'),
        ('GSC/ITF/IAM','3000371990'),
        ('GSC/ITF/MGT','3000371989'),
        ('GSC/MGT/GSC','3000387598'),
        ('GSC/MGT/MGT','3000371994'),
        ('GSC/REF/MGT','3000371979'),
        ('GSC/REF/RDM','3000314914'),
        ('GSC/REF/TDM','3000371912')
        `);
    await queryRunner.query(`
        INSERT INTO datalake_gpc_partner (datalakename, gpcname)
        VALUES
        ('AFMO','AFMO_BSC'),
        ('ALDA','ALDA'),
        ('AMER','AMER'),
        ('ASSU','ASSU_BSC'),
        ('BDDF','BDDF'),
        ('CDN','CDN'),
        ('COMM','COMM'),
        ('CPLE','CPLE'),
        ('DFIN','DFIN'),
        ('DGLE','DGLE'),
        ('EURO','EURO_BSC'),
        ('FRF','FRF'),
        ('GBSU','GBSU'),
        ('GLBA','GLBA'),
        ('GSPR','GSPR'),
        ('GTPS','GTPS'),
        ('HRCO','HRCO'),
        ('IGAD','IGAD'),
        ('IRBS','AFMO_BSC'),
        ('ITIM','ITIM'),
        ('MARK','MARK'),
        ('RESG/ACH','RESG/ACH'),
        ('RESG/DIR','RESG/DIR'),
        ('RESG_GSC','RESG_GSC'),
        ('RESG/GTS','RESG/GTS'),
        ('RESG/IMM','RESG/IMM'),
        ('RESG/SGC','RESG/SGC'),
        ('RESG/TPS','RESG/TPS'),
        ('RISQ','RISQ'),
        ('RUSS','RUSS_BSC'),
        ('SEGL','SEGL'),
        ('SGEF','SGEF_BSC'),
        ('SGSS','SGSS'),
        ('TRANSACTIS','TRS'),
        ('WAAM','WAAM'),
        ('NB25', 'NB25');
        `);
    await queryRunner.query(`
        INSERT INTO datalake_gpc_payor (payorname, gpcpartnername)
        VALUES
        ('FAT/TSV/SOC','BSC_SOC'),
        ('RESG BSC FAT TSV DNA DDS','GSPR'),
        ('RESG/BSC/CRL/ODS/OCR','BSC_OdS'),
        ('RESG/BSC/DAT/ODS/DDD','BSC_OdS'),
        ('RESG/BSC/DAT/ODS/QDO','BSC_OdS'),
        ('RESG/BSC/DAT/VDF','BSC_AC'),
        ('RESG/BSC/DCO/ODS/CHA','BSC_OdS'),
        ('RESG/BSC/DCO/ODS/DEM','BSC_OdS'),
        ('RESG/BSC/DCO/ODS/LIF','BSC_OdS'),
        ('RESG/BSC/DCO/ODS/SCA','BSC_OdS'),
        ('RESG/BSC/DCO/ODS/SHA','BSC_OdS'),
        ('RESG/BSC/DSO/ODS/AUT','BSC_OdS'),
        ('RESG/BSC/DSO/ODS/SIG','BSC_OdS'),
        ('RESG/BSC/DSO/VDF','BSC_AC'),
        ('RESG/BSC/FAE/ASS/MOO','ASSU_BSC'),
        ('RESG/BSC/FAE/BDD/CDN','CDN'),
        ('RESG/BSC/FAE/BDD/CGA','GTPS'),
        ('RESG/BSC/FAE/BDD/FRF','FRF'),
        ('RESG/BSC/FAE/DF./EBS','RESG_EBS'),
        ('RESG/BSC/FAE/DF./GSC','RESG_GSC'),
        ('RESG/BSC/FAE/DF./RESG/BSC','BSC_AC'),
        ('RESG/BSC/FAE/IRB/CAP','ASSU_BSC'),
        ('RESG/BSC/FAE/IRB/CGL','ASSU_BSC'),
        ('RESG/BSC/FAE/WAA/BEL','WAAM'),
        ('RESG/BSC/FAE/WAA/BTL','WAAM'),
        ('RESG/BSC/FAT/TSV','BSC_AC'),
        ('RESG/BSC/FAT/TSV/CTA','BSC_TRA'),
        ('RESG/BSC/FAT/TSV/PNV','BSC_TRA'),
        ('RESG/BSC/H2R/ODS/JMP','BSC_OdS'),
        ('RESG/BSC/H2R/ODS/PLS','BSC_OdS'),
        ('RESG/BSC/H2R/ODS/RIT','BSC_OdS'),
        ('RESG/BSC/H2R/ODS/SIM','BSC_OdS'),
        ('RESG/BSC/H2R/ODS/TOK','BSC_OdS'),
        ('RESG/BSC/H2R/TSV','BSC_AC'),
        ('RESG/BSC/multipayeur','BSC_AC'),
        ('RESG/BSC/ODS Case Management','BSC_OdS'),
        ('RESG BSC FAT TSV DNA CFT ','GSPR');
        `);
  }
}
