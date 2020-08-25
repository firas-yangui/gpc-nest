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
    QUEUE: Object.freeze({
      PYRAMID_QUEUE: Object.freeze({
        NAME: 'PYRAMID',
        ORIGIN_SEPARATOR: '\\|@\\|',
        SEPARATOR: ';',
        HEADER: [
          'Ressource_Staff_Type',
          'Ressource_CDS',
          'Ressource_CSM',
          'Client_Entity',
          'portfolio_sub_portfolio',
          'plan',
          'activity_Type',
          'actuals_md',
          'etc_eac_ke',
          'etc_eac',
          'actuals_eac',
          'actuals_eac_ke',
          'partner_actuals',
          'payor_actuals',
          'partner_etc',
          'payor_etc',
          'Month_Monthly_report',
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
