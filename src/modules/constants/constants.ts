import { Global } from '@nestjs/common';

@Global()
export class ConstantService {
  public GLOBAL_CONST = Object.freeze({
    AMOUNT_UNITS: Object.freeze({
      KLC: 'klocalcurrency',
      KEURO: 'keuros',
      KEURO_SALES: 'keurossales',
      MD: 'mandays',
    }),
    SCOPES: Object.freeze({
      IRBS: 1,
      BSC: 2,
    }),
    CRON_INTERVAL: '10 minutes', // 10 minutes
    QUEUE: Object.freeze({
      PYRAMID_QUEUE: Object.freeze({
        NAME: 'EAC',
        ORIGIN_SEPARATOR: '\\|@\\|',
        SEPARATOR: ';',
        HEADER: [
          'Project_Code',
          'Project_Name',
          'Activity_Application',
          'Activity_Application_Label',
          'curve_type',
          'eac',
          'eac_ke',
          'CDS',
          'CSM',
          'PARENT_DESCR',
          'staff_type',
          'activity_plan',
          'activity_type',
          'portfolio',
          'sub_portfolio',
          'partner',
          'code_ca_payor',
          'payor',
          'Client_Entity',
          'pyr_tmp_month_mr',
        ],
      }),
      PYRAMIDACTUALS_OUTSOURCING_QUEUE: Object.freeze({
        NAME: 'PMD',
        ORIGIN_SEPARATOR: '\\|@\\|',
        SEPARATOR: ';',
        HEADER: [
          'Project_Code',
          'Project_Name',
          'Activity_Application',
          'Activity_Application_Label',
          'curve_type',
          'eac',
          'eac_ke',
          'CDS',
          'CSM',
          'PARENT_DESCR',
          'staff_type',
          'activity_plan',
          'activity_type',
          'portfolio',
          'sub_portfolio',
          'partner',
          'code_ca_payor',
          'payor',
          'Client_Entity',
          'pyr_tmp_month_mr',
        ],
      }),
      PYRAMIDACTUALS_QUEUE: Object.freeze({
        NAME: 'TM',
        ORIGIN_SEPARATOR: '\\|@\\|',
        SEPARATOR: ';',
        HEADER: [
          'resource_igg',
          'resource_first_name',
          'resource_last_name',
          'Resource_Location',
          'Resource_Staff_type_description',
          'Ressource_Staff_Type',
          'Ressource_CDS',
          'Ressource_CSM',
          'Ressource_Team',
          'Ressource_Sub_Team',
          'Client_Entity',
          'Month_timetracking',
          'Year_timetracking',
          'Project_code',
          'schedule_name',
          'portfolio_sub_portfolio',
          'sub_portfolio',
          'axe',
          'plan',
          'activity_Type',
          'WBS_element_name',
          'task_name',
          'owner',
          'payor',
          'Label_Payor',
          'Partner',
          'application',
          'standard_actuals_integrated_md',
          'Month_Monthly_report',
          'ressource_name',
          'start_date',
          'end_date',
          'contract_number',
          'contract_type',
          'start_date_contract',
          'end_date_contract',
          'siren',
          'bu_su',
          'application_label',
          'activity_code',
          'immo',
        ],
      }),
      NOSICA_QUEUE: Object.freeze({
        NAME: 'NOSICA',
        ORIGIN_SEPARATOR: '\\|@\\|',
        SEPARATOR: ';',
        HEADER: [
          'fiscal_year',
          'accounting_period',
          'code_guichet',
          'code_currency_base',
          'code_ledger',
          'situation_date',
          'code_snrg',
          'insert_date',
          'cds',
          'ytd_amount_base_currency_wo_adjust',
          'ytd_amount_trans_currency_wo_adjust',
          'ytd_amount_eur_currency_wo_adjust',
          'ytd_amount_base_currency_wi_adjust',
          'ytd_amount_trans_currency_wi_adjust',
          'ytd_amount_eur_currency_wi_adjust',
          'ytd_amount_base_currency_wi_adjust_after_comp',
          'ytd_amount_trans_currency_wi_adjust_after_compl',
          'ytd_amount_eur_currency_wi_adjust_after_compl',
        ],
      }),
      MYGTS_QUEUE: Object.freeze({
        NAME: 'MYGTS',
        ORIGIN_SEPARATOR: '\\|@\\|',
        SEPARATOR: ';',
        HEADER: ['ClientLongName', '€', 'Code NRG', 'Gamme', 'Sous-Gamme', 'Mois'],
      }),
    }),
  });
}
