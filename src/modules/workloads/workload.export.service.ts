import { Injectable } from '@nestjs/common';
import { assertOnlyNumbers, sqlEscape } from '../../utils/utils';
import { SynthesisFilterDTO } from './dto/synthesis-filter.dto';
import { WorkloadExportDataItemDTO } from './dto/workload-export-data-item.dto';
import { getManager } from 'typeorm';
import { WorkloadExportByDepartmentDataItemDTO } from './dto/workload-export-by-department-data-item.dto';
import { WorkloadExportPeriodAmountsDTO } from './dto/workload-export-period-amounts.dto';
import { WorkloadExportByPeriodWithPartnerDataItemDTO } from './dto/workload-export-with-partner-data-item.dto';

@Injectable()
export class WorkloadExportService {
  async exportCsvByPeriodWithPartners(
    gpcAppSettingsId: number,
    syntheseFilter: SynthesisFilterDTO,
    periodIds: number[],
  ): Promise<WorkloadExportByPeriodWithPartnerDataItemDTO[]> {
    let fullSQL = `
          SELECT  subsidiaryallocation.id                   AS id,
                  subsidiaryallocation.weight               AS weight,
                  subsidiaryallocation.workloadid           AS workload_id,
                  service.id                                AS service_id,
                  service.name                              AS service_name,
                  service_app_setting_third_party.name      AS service_third_party_name,
                  service.description                       AS service_description,
                  subservice.id                             AS sub_service_id,
                  subservice.name                           AS sub_service_name,
                  subservice.code                           AS sub_service_code,
                  subservice.priority                       AS sub_service_priority,
                  sub_service_third_party.id                AS sub_service_third_party_id,
                  sub_service_third_party.name              AS sub_service_third_party_name,
                  workload.code                             AS workload_code,
                  workload.description                      AS workload_description,
                  subnature.name                            AS workload_sub_nature_name,
                  workload_third_party.id                   AS workload_third_party_id,
                  workload_third_party.name                 AS workload_third_party_name,
                  workload_third_party_gpcappsettings.type  AS workload_third_party_gpcappsettings_type,
                  subsidiaryallocation.id                   AS allocation_id,
                  allocation_third_party.name               AS allocation_third_party_name,
                  allocation_third_party.trigram            AS allocation_third_party_trigram,
                  allocation_third_party_parent.trigram     AS allocation_third_party_parent_trigram,
                  allocation_third_party_parent.name        AS allocation_third_party_parent_name,
                  amount.keuros                             AS workload_amount_k_euros,
                  amount.mandays                            AS workload_amount_man_days,
                  amount.keurossales                        AS workload_amount_k_euros_sales,
                 --Add into sql legacy, replace frontend work
                  subsidiaryallocation.weight/totalWeight                                           AS allocation_percentage,
                  amount.keuros*subsidiaryallocation.weight/totalWeight                             AS weighted_amount_k_euros,
                  amount.mandays*subsidiaryallocation.weight/totalWeight                            AS weighted_amount_man_days,
                  amount.keurossales*subsidiaryallocation.weight/totalWeight                        AS weighted_amount_k_euros_sales,
                 --End add
                  subtypology.name                          AS sub_typology_name,
                  subtypology.businesstype                  AS sub_typology_business_type,
                  workload.isenvelope                       AS workload_is_envelope,
                  stake.englishname                         AS stake_name,
                  workload.status                           AS workload_status,
                  amount.id                                 AS amount_id,
                  amount.status                             AS workload_amount_status,
                  subserviceperiod.isinvested               AS sub_service_is_invested,
                  workload.isinvested                       AS workload_is_invested,
                  activitydomain.name                       AS service_activity_domain_name,
                  subservice.var1                           AS sub_service_var1,
                  subservice.var2                           AS sub_service_var2,
                  subservice.var3                           AS sub_service_var3,
                  subservice.var4                           AS sub_service_var4,
                  subservice.var5                           AS sub_service_var5,
                  program.name                              AS program_name,
                  program.code                              AS program_code,
                  portfolio.frenchname                      AS sub_portfolio_name,
                  workload_gpcappsettings.id                AS workload_gpcappsettings_id,
                  workload_gpcappsettings.name              AS workload_gpcappsettings_name,
                  subservice.tags                           AS tags
            
                FROM subsidiaryallocation
                FULL JOIN workload
                  ON subsidiaryallocation.workloadid = workload.id
            
                FULL JOIN subservice
                  ON workload.subserviceid = subservice.id
            
                FULL JOIN service
                  ON subservice.serviceid = service.id
            
                FULL JOIN serviceappsettings service_app_setting
                  ON service_app_setting.modelid = service.id
                  AND ${gpcAppSettingsId} = service_app_setting.gpcappsettingsid
            
                FULL JOIN thirdparty sub_service_third_party
                  ON subservice.thirdpartyid = sub_service_third_party.id
            
                FULL JOIN thirdparty workload_third_party
                  ON workload.thirdpartyid = workload_third_party.id
            
                FULL JOIN thirdpartyappsettings workload_third_party_gpcappsettings
                  ON workload_third_party.id = workload_third_party_gpcappsettings.modelid
                  AND ${gpcAppSettingsId} = workload_third_party_gpcappsettings.gpcappsettingsid
            
                LEFT JOIN gpcappsettings workload_gpcappsettings
                  ON workload_gpcappsettings.id = workload_third_party_gpcappsettings.gpcappsettingsid
                  AND ${gpcAppSettingsId} = workload_gpcappsettings.id
            
                FULL JOIN thirdparty allocation_third_party
                  ON subsidiaryallocation.thirdpartyid = allocation_third_party.id
            
                FULL JOIN thirdparty allocation_third_party_parent
                  ON allocation_third_party.thirdpartyparent = allocation_third_party_parent.trigram
            
                FULL JOIN subnature
                  ON workload.subnatureid = subnature.id
            
                FULL JOIN amount
                  ON amount.workloadid = workload.id
                  AND amount.periodid = subsidiaryallocation.periodid
            
                FULL JOIN subtypology
                  ON subservice.subtypologyid = subtypology.id
                  --Add into sql legacy for Filter
                LEFT OUTER JOIN subtypologyappsettings sub_service_sub_typology_app_setting
                          ON sub_service_sub_typology_app_setting.modelid = subtypology.id AND
                             sub_service_sub_typology_app_setting.gpcappsettingsid = ${gpcAppSettingsId}
                  --End Add
            
                LEFT JOIN program
                  ON program.id = subservice.programid
            
                FULL JOIN portfolio
                  ON portfolio.id = subservice.portfolioid
            
                FULL JOIN stake
                  ON subservice.stakeid = stake.id
                FULL JOIN activitydomain
                  ON service_app_setting.activitydomainid = activitydomain.id
                FULL JOIN thirdparty service_app_setting_third_party
                  ON service_app_setting.thirdpartyid = service_app_setting_third_party.id
                FULL JOIN subserviceperiod
                  ON subserviceperiod.subserviceid = subservice.id
                  AND subserviceperiod.periodid = subsidiaryallocation.periodid
                  --Add into sql legacy, replace frontend work   
                INNER JOIN
                     (SELECT workloadid, SUM(weight) AS totalWeight FROM subsidiaryallocation
                      WHERE periodId =${periodIds[0]} GROUP BY workloadid) totals ON totals.workloadid = subsidiaryallocation.workloadid
                WHERE
                  subsidiaryallocation.periodid = ${periodIds[0]}
                 -- AND subsidiaryallocation.thirdpartyid = ANY (third_party_ids)  --TODO after user maxAutorization integration
                  AND workload_third_party_gpcappSettings.type IN ('mixed', 'organization', 'partner')
      `; //${periodIds[0]}: selected period

    fullSQL = this.addFilterToSQL(fullSQL, syntheseFilter);
    console.info('fullSQLExportByPeriodWithPartners:' + fullSQL);

    const entityManager = getManager();
    const res = await entityManager.query(fullSQL);

    return res as WorkloadExportByPeriodWithPartnerDataItemDTO[];
  }

  //temporarily unnecessary
  /*async exportCsvByDepartment(
  gpcAppSettingsId: number,
  syntheseFilter: SynthesisFilterDTO,
  periodIds: number[],
): Promise<WorkloadExportByDepartmentDataItemDTO[]> {
  let fullSQL = `
          SELECT subsidiaryallocation.id                  AS id,
                 subsidiaryallocation.weight              AS weight,
                 subsidiaryallocation.workloadid          AS workload_id,
                 service.id                               AS service_id,
                 service.name                             AS service_name,
                 service_app_setting_third_party.name     AS service_third_party_name,
                 service.description                      AS service_description,
                 subservice.id                            AS sub_service_id,
                 subservice.name                          AS sub_service_name,
                 subservice.code                          AS sub_service_code,
                 subservice.priority                      AS sub_service_priority,
                 sub_service_third_party.id               AS sub_service_third_party_id,
                 sub_service_third_party.name             AS sub_service_third_party_name,
                 workload.code                            AS workload_code,
                 workload.description                     AS workload_description,
                 subnature.name                           AS workload_sub_nature_name,
                 workload_third_party.id                  AS workload_third_party_id,
                 workload_third_party.name                AS workload_third_party_name,
                 workload_third_party_gpcappsettings.type AS workload_third_party_gpcappsettings_type,
                 subsidiaryallocation.id                  AS allocation_id,
                 allocation_third_party.name              AS allocation_third_party_name,
                 allocation_third_party.trigram           AS allocation_third_party_trigram,
                 allocation_third_party_parent.trigram    AS allocation_third_party_parent_trigram,
                 allocation_third_party_parent.name       AS allocation_third_party_parent_name,
                 amount.keuros                            AS workload_amount_k_euros,
                 amount.mandays                           AS workload_amount_man_days,
                 amount.keurossales                       AS workload_amount_k_euros_sales,
                 subsidiaryallocation.weight/totalWeight                                           AS allocationPercentage,
                 amount.keuros*subsidiaryallocation.weight/totalWeight                             AS weighted_amount_k_euros,
                 amount.mandays*subsidiaryallocation.weight/totalWeight                            AS weighted_amount_man_days,
                 amount.keurossales*subsidiaryallocation.weight/totalWeight                        AS weighted_amount_k_euros_sales,
                 subtypology.name                         AS sub_typology_name,
                 subtypology.businesstype                 AS sub_typology_business_type,
                 workload.isenvelope                      AS workload_is_envelope,
                 stake.englishname                        AS stake_name,
                 workload.status                          AS workload_status,
                 amount.id                                AS amount_id,
                 amount.status                            AS workload_amount_status,
                 subserviceperiod.isinvested              AS sub_service_is_invested,
                 workload.isinvested                      AS workload_is_invested,
                 activitydomain.name                      AS service_activity_domain_name,
                 subservice.var1                          AS sub_service_var1,
                 subservice.var2                          AS sub_service_var2,
                 subservice.var3                          AS sub_service_var3,
                 subservice.var4                          AS sub_service_var4,
                 subservice.var5                          AS sub_service_var5,
                 program.name                             AS program_name,
                 program.code                             AS program_code,
                 portfolio.frenchname                     AS sub_portfolio_name,
                 workload_gpcappsettings.id               AS workload_gpcappsettings_id,
                 workload_gpcappsettings.name             AS workload_gpcappsettings_name,
                 subservice.tags                          AS tags

          FROM subsidiaryallocation
                   FULL JOIN workload
                             ON subsidiaryallocation.workloadid = workload.id

                   FULL JOIN subservice
                             ON workload.subserviceid = subservice.id

                   FULL JOIN service
                             ON subservice.serviceid = service.id

                   FULL JOIN serviceappsettings service_app_setting
                             ON service_app_setting.modelid = service.id
                                 AND ${gpcAppSettingsId} = service_app_setting.gpcappsettingsid

                   FULL JOIN thirdparty sub_service_third_party
                             ON subservice.thirdpartyid = sub_service_third_party.id

                   FULL JOIN thirdparty workload_third_party
                             ON workload.thirdpartyid = workload_third_party.id

                   FULL JOIN thirdpartyappsettings workload_third_party_gpcappsettings
                             ON workload_third_party.id = workload_third_party_gpcappsettings.modelid
                                 AND ${gpcAppSettingsId} = workload_third_party_gpcappsettings.gpcappsettingsid

                   LEFT JOIN gpcappsettings workload_gpcappsettings
                             ON workload_gpcappsettings.id = workload_third_party_gpcappsettings.gpcappsettingsid
                                 AND ${gpcAppSettingsId} = workload_gpcappsettings.id

                   FULL JOIN thirdparty allocation_third_party
                             ON subsidiaryallocation.thirdpartyid = allocation_third_party.id

                   FULL JOIN thirdparty allocation_third_party_parent
                             ON allocation_third_party.thirdpartyparent = allocation_third_party_parent.trigram

                   FULL JOIN subnature
                             ON workload.subnatureid = subnature.id

                   FULL JOIN amount
                             ON amount.workloadid = workload.id
                                 AND amount.periodid = subsidiaryallocation.periodid

                   FULL JOIN subtypology
                             ON subservice.subtypologyid = subtypology.id

                   LEFT JOIN program
                             ON program.id = subservice.programid

                   FULL JOIN portfolio
                             ON portfolio.id = subservice.portfolioid

                   FULL JOIN stake
                             ON subservice.stakeid = stake.id
                   FULL JOIN activitydomain
                             ON service_app_setting.activitydomainid = activitydomain.id
                   FULL JOIN thirdparty service_app_setting_third_party
                             ON service_app_setting.thirdpartyid = service_app_setting_third_party.id
                   FULL JOIN subserviceperiod
                             ON subserviceperiod.subserviceid = subservice.id
                                 AND subserviceperiod.periodid = subsidiaryallocation.periodid
                   INNER JOIN
               (SELECT workloadid, SUM(weight) AS totalWeight FROM subsidiaryallocation
                WHERE periodId =${periodIds[0]} GROUP BY workloadid) totals ON totals.workloadid = subsidiaryallocation.workloadid
          WHERE subsidiaryallocation.periodid = ${periodIds[0]}
            AND workload_third_party_gpcappSettings.type IN ('mixed', 'organization', 'partner');
      `; //${periodIds[0]}: campaign period

  fullSQL = this.addFilterToSQL(fullSQL, syntheseFilter);
  console.info('fullSQL:' + fullSQL);

  const entityManager = getManager();
  const res = await entityManager.query(fullSQL);

  return res as WorkloadExportByDepartmentDataItemDTO[];
}*/

  async exportCsvWorkload(gpcAppSettingsId: number, syntheseFilter: SynthesisFilterDTO, periodIds: number[]): Promise<WorkloadExportDataItemDTO[]> {
    const filter = syntheseFilter;

    let fullSQL = `
            SELECT workload.id                                    AS workload_id,
                   workload.code                                  AS workload_name,
                   workload.description                           AS workload_description,
                   workload_sub_nature.name                       AS workload_sub_nature_name,
                   workload_sub_nature.code                       AS workload_sub_nature_code,
                   workload_third_party.name                      AS workload_third_party_name,
                   workload_third_party.trigram                   AS workload_third_party_trigram,
                   workload_third_party.thirdpartyparent          AS workload_third_party_parent,
                   workload.status                                AS workload_status,
                   subservice.id                                  AS sub_service_id,
                   subservice.name                                AS sub_service_name,
                   subservice.code                                AS sub_service_code,
                   subservice.priority                            AS sub_service_priority,
                   subservice.applicant                           AS sub_service_applicant,
                   subservice.itmasterplan                        AS sub_service_itmasterplan,
                   sub_service_third_party.name                   AS sub_service_third_party_name,
                   sub_service_third_party.trigram                AS sub_service_third_party_trigram,
                   service.id                                     AS service_id,
                   service.name                                   AS service_name,
                   service.code                                   AS service_code,
                   service_app_setting_third_party.name           AS service_app_setting_third_party_name,
                   service_app_setting_third_party.trigram        AS service_app_setting_third_party_trigram,
                   sub_service_sub_typology_app_setting.plan      AS sub_service_sub_typology_plan,
                   sub_service_sub_typology.businesstype          AS sub_service_sub_typology_business_type,
                   sub_service_irt_application.codeirt            AS sub_service_irt_application_code_irt,
                   sub_service_irt_application.label              AS sub_service_irt_application_label,
                   workload_third_party.radical                   AS workload_third_party_radical,
                   service_app_setting_activity_domain.name       AS service_app_setting_activity_domain_name,
                   service_app_setting_activity_domain.funcdomain AS service_app_setting_activity_domain_func_domain,
                   sub_service_phase.englishname                  AS sub_service_phase_english_name,
                   subservice.projectmanager                      AS sub_service_project_manager,
                   subservice.sponsor                             AS sub_service_sponsor,
                   subservice.axis                                AS sub_service_axis,
                   workload.isenvelope                            AS workload_is_envelop,
                   workload.isinvested                            AS workload_is_invested,
                   workload_person_in_charge.lastname             AS workload_person_in_charge_last_name,
                   workload_person_in_charge.firstname            AS workload_person_in_charge_first_name,
                   workload_person_in_charge.bipcode              AS workload_person_in_charge_bip_code,
                   subservice.itresponsible                       AS sub_service_it_responsible,
                   subservice.businessmanager                     AS sub_service_business_manager,
                   subservice.var1                                AS sub_service_var1,
                   subservice.var2                                AS sub_service_var2,
                   subservice.var3                                AS sub_service_var3,
                   subservice.var4                                AS sub_service_var4,
                   subservice.var5                                AS sub_service_var5,
                   ${this.includePeriodFields(
                     periodIds,
                     gpcAppSettingsId,
                   )} sub_service_portfolio.frenchname                           AS sub_service_portfolio_name, sub_service_portfolio_app_setting.strategicbusinesspartner AS sub_service_portfolio_app_setting_sbp,
                   sub_service_program.name                       AS sub_service_program_name,
                   sub_service_program.code                       AS sub_service_program_code,
                   subservice.cacode                              AS sub_service_cacode,
                   subservice.tags                                AS tags

            FROM workload
                     FULL JOIN subnature workload_sub_nature
                               ON workload_sub_nature.id = workload.subnatureid
                     FULL JOIN thirdparty workload_third_party
                               ON workload.thirdpartyid = workload_third_party.id
                     FULL JOIN gpcuser workload_person_in_charge
                               ON workload.personinchargeid = workload_person_in_charge.id
                     FULL JOIN subservice
                               ON subservice.id = workload.subserviceid
                     FULL JOIN thirdparty sub_service_third_party
                               ON sub_service_third_party.id = subservice.thirdpartyid
                     FULL JOIN subtypology sub_service_sub_typology
                               ON sub_service_sub_typology.id = subservice.subtypologyid
                     FULL JOIN subtypologyappsettings sub_service_sub_typology_app_setting
                               ON sub_service_sub_typology_app_setting.modelid = sub_service_sub_typology.id AND
                                  sub_service_sub_typology_app_setting.gpcappsettingsid = ${gpcAppSettingsId}
                     FULL JOIN irtapplication sub_service_irt_application
                               ON sub_service_irt_application.id = subservice.irtapplicationid
                     FULL JOIN phase sub_service_phase
                               ON sub_service_phase.id = subservice.phaseid
                     FULL JOIN portfolio sub_service_portfolio
                               ON sub_service_portfolio.id = subservice.portfolioid
                     FULL JOIN portfolioappsettings sub_service_portfolio_app_setting
                               ON sub_service_portfolio_app_setting.modelid = sub_service_portfolio.id
                                   AND ${gpcAppSettingsId} = sub_service_portfolio_app_setting.gpcappsettingsid
                     LEFT JOIN program sub_service_program
                               ON sub_service_program.id = subservice.programid
                     LEFT OUTER JOIN subnature
                               ON workload.subnatureid = subnature.id

                     FULL JOIN service
                               ON service.id = subservice.serviceid
                     FULL JOIN serviceappsettings service_app_setting
                               ON service_app_setting.modelid = service.id
                                   AND ${gpcAppSettingsId} = service_app_setting.gpcappsettingsid
                     FULL JOIN thirdparty service_app_setting_third_party
                               ON service_app_setting_third_party.id = service_app_setting.thirdpartyid
                     FULL JOIN activitydomain service_app_setting_activity_domain
                               ON service_app_setting_activity_domain.id = service_app_setting.activitydomainid
                ${this.includePeriodJoins(periodIds)}

            WHERE 1=1
        `;

    fullSQL = this.addPeriodWhereToSQL(fullSQL, periodIds);
    fullSQL = this.addFilterToSQL(fullSQL, filter);

    console.info('export all full sql' + fullSQL);

    const entityManager = getManager();
    const res = await entityManager.query(fullSQL);
    this.convertPeriodColumnsToDTOArray(res, periodIds.length);
    return res as WorkloadExportDataItemDTO[];
  }

  private includePeriodFields = (periodIds: number[], gpcappsettingsid: number) => {
    //AFMO partner trigram column contains a list of partners with their weights
    if (gpcappsettingsid == 1) {
      return periodIds
        ? periodIds
            .map(
              (pId, i) => `
    sub_service_period_${i}.isinvested                        AS sub_service_period_${i}_is_invested,
    workload_period_amount_${i}.id                            AS workload_period_${i}_amount_id,
    workload_period_amount_${i}.status                        AS workload_period_${i}_amount_status,
    workload_period_amount_${i}.keuros                        AS workload_period_${i}_amount_k_euros,
    workload_period_amount_${i}.mandays                       AS workload_period_${i}_amount_man_days,
    workload_period_amount_${i}.keurossales                   AS workload_period_${i}_amount_k_euros_sales,
    workload_period_amount_${i}.klocalcurrency                AS workload_period_${i}_amount_k_local_currency,
    sub_service_reporting_${i}.achievement                    AS sub_service_period_${i}_reporting_achievement,
    sub_service_reporting_${i}.elapsedtime                    AS sub_service_period_${i}_reporting_elapsed_time,
    
    (select string_agg(p_${i}.trigram||' (weight:'||p_${i}.weight||')', ','||Chr(13))
        from (select distinct partner_${i}.trigram, ssda_${i}.weight
              from subsidiaryallocation ssda_${i}
                       left outer join thirdparty partner_${i} on partner_${i}.id = ssda_${i}.thirdpartyid
                       inner join thirdpartyappsettings partneras_${i}
                                  on partner_${i}.id = partneras_${i}.modelid and partneras_${i}.gpcappsettingsid = ${gpcappsettingsid}
              where workload.id = ssda_${i}.workloadid and ssda_${i}.periodid=${pId}) p_${i}
       )
                               AS workload_period_${i}_partner_trigrams,
        `,
            )
            .join('')
        : '';
    } else {
      //BSC partner trigram column only has one partner per period
      return periodIds
        ? periodIds
            .map(
              (pId, i) => `
    sub_service_period_${i}.isinvested                        AS sub_service_period_${i}_is_invested,
    workload_period_amount_${i}.id                            AS workload_period_${i}_amount_id,
    workload_period_amount_${i}.status                        AS workload_period_${i}_amount_status,
    workload_period_amount_${i}.keuros                        AS workload_period_${i}_amount_k_euros,
    workload_period_amount_${i}.mandays                       AS workload_period_${i}_amount_man_days,
    workload_period_amount_${i}.keurossales                   AS workload_period_${i}_amount_k_euros_sales,
    workload_period_amount_${i}.klocalcurrency                AS workload_period_${i}_amount_k_local_currency,
    sub_service_reporting_${i}.achievement                    AS sub_service_period_${i}_reporting_achievement,
    sub_service_reporting_${i}.elapsedtime                    AS sub_service_period_${i}_reporting_elapsed_time,
    
    (select string_agg(p_${i}.trigram, ',')
        from (select distinct partner_${i}.trigram
              from subsidiaryallocation ssda_${i}
                       left outer join thirdparty partner_${i} on partner_${i}.id = ssda_${i}.thirdpartyid
                       inner join thirdpartyappsettings partneras_${i}
                                  on partner_${i}.id = partneras_${i}.modelid and partneras_${i}.gpcappsettingsid = ${gpcappsettingsid}
              where workload.id = ssda_${i}.workloadid and ssda_${i}.periodid=${pId}) p_${i}
       )
                               AS workload_period_${i}_partner_trigrams,
        `,
            )
            .join('')
        : '';
    }
  };

  private includePeriodJoins = (periodIds: number[]) =>
    periodIds
      ? periodIds
          .map(
            (pId, i) => `
           left outer join amount workload_period_amount_${i} on workload.id = workload_period_amount_${i}.workloadid and workload_period_amount_${i}.periodid = ${assertOnlyNumbers(
              pId,
            )}
           left outer join projectreporting sub_service_reporting_${i} ON sub_service_reporting_${i}.subserviceid = subservice.id AND sub_service_reporting_${i}.periodid = ${assertOnlyNumbers(
              pId,
            )}
 
           left outer join subserviceperiod sub_service_period_${i} ON sub_service_period_${i}.subserviceid = subservice.id AND sub_service_period_${i}.periodid = ${assertOnlyNumbers(
              pId,
            )}
        `,
          )
          .join('')
      : '';

  private addPeriodWhereToSQL(fullSQL: string, periodIds: number[]) {
    const periodWhere: string[] = [];
    periodIds.forEach((pId, i) =>
      periodWhere.push(
        ` workload_period_amount_${i}.keuros!=0 `,
        ` workload_period_amount_${i}.mandays!=0 `,
        ` workload_period_amount_${i}.keurossales!=0`,
        ` workload_period_amount_${i}.klocalcurrency!=0`,
      ),
    );
    fullSQL += ` AND ( ` + periodWhere.join(' OR ') + `) `;
    return fullSQL;
  }

  private addFilterToSQL(fullSQL: string, filter: SynthesisFilterDTO) {
    //filter section
    if (filter && filter.portfolios && filter.portfolios.length > 0) {
      assertOnlyNumbers(filter.portfolios);
      fullSQL += ` AND service.id in (${filter.portfolios.map(assertOnlyNumbers).join(',')}) `;
    }
    if (filter && filter.code) {
      fullSQL += ` 
      AND (upper(workload.code) like upper('%${sqlEscape(filter.code)}%') 
           OR upper(subservice.code) like upper('%${sqlEscape(filter.code)}%') 
           OR upper(service.name) like upper('%${sqlEscape(filter.code)}%') )
           `;
    }
    if (filter && filter.description) {
      fullSQL += ` 
      AND (upper(workload.description) like upper('%${sqlEscape(filter.description)}%') 
           OR upper(subservice.name) like upper('%${sqlEscape(filter.description)}%') )
           `;
    }
    if (filter && filter.plans && filter.plans.length > 0) {
      fullSQL += ` AND sub_service_sub_typology_app_setting.plan in ('${filter.plans.map(sqlEscape).join(`','`)}') `;
    }
    if (filter && filter.thirdparties && filter.thirdparties.length > 0) {
      fullSQL += ` AND workload.thirdpartyid in (${filter.thirdparties.map(assertOnlyNumbers).join(',')}) `;
    }
    if (filter && filter.subnatures && filter.subnatures.length > 0) {
      fullSQL += ` AND subnature.id in (${filter.subnatures.map(assertOnlyNumbers).join(',')}) `;
    }
    if (filter && filter.domains && filter.domains.length > 0) {
      fullSQL += ` AND service_app_setting_activity_domain.id in (${filter.domains.map(assertOnlyNumbers).join(',')}) `;
    }
    return fullSQL;
  }

  private convertPeriodColumnsToDTOArray(res: WorkloadExportDataItemDTO[], periodsCount: number) {
    res.forEach(line => {
      line.periodAmounts = [];
      for (let i = 0; i < periodsCount; i++) {
        const periodDTO: Partial<WorkloadExportPeriodAmountsDTO> = {};

        // eslint-disable-next-line @typescript-eslint/camelcase
        periodDTO.is_invested = line[`sub_service_period_${i}_is_invested`];
        periodDTO.id = line[`workload_period_${i}_amount_id`];
        periodDTO.status = line[`workload_period_${i}_amount_status`];
        periodDTO.keuros = line[`workload_period_${i}_amount_k_euros`];
        periodDTO.mandays = line[`workload_period_${i}_amount_man_days`];
        periodDTO.keurossales = line[`workload_period_${i}_amount_k_euros_sales`];
        periodDTO.klocalcurrency = line[`workload_period_${i}_amount_k_local_currency`];
        // eslint-disable-next-line @typescript-eslint/camelcase
        periodDTO.reporting_achievement = line[`sub_service_period_${i}_reporting_achievement`];
        // eslint-disable-next-line @typescript-eslint/camelcase
        periodDTO.reporting_elapsed_tim = line[`sub_service_period_${i}_reporting_elapsed_time`];
        // eslint-disable-next-line @typescript-eslint/camelcase
        periodDTO.partner_trigrams = line[`workload_period_${i}_partner_trigrams`];

        delete line[`sub_service_period_${i}_is_invested`];
        delete line[`workload_period_${i}_amount_id`];
        delete line[`workload_period_${i}_amount_status`];
        delete line[`workload_period_${i}_amount_k_euros`];
        delete line[`workload_period_${i}_amount_man_days`];
        delete line[`workload_period_${i}_amount_k_euros_sales`];
        delete line[`workload_period_${i}_amount_k_local_currency`];
        delete line[`sub_service_period_${i}_reporting_achievement`];
        delete line[`sub_service_period_${i}_reporting_elapsed_time`];

        line.periodAmounts.push(periodDTO as WorkloadExportPeriodAmountsDTO);
      }
    });
  }
}
