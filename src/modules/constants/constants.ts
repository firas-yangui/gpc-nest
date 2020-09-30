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
    QUEUE: Object.freeze({
      PYRAMID_QUEUE: Object.freeze({
        NAME: 'PYRAMID',
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
    }),
  });
}
