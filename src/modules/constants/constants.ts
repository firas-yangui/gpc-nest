import { Global } from '@nestjs/common';

@Global()
export class ConstantService {
  private defaultEmailTo: string[] = [
    'anouer.hammami-ext@socgen.com',
    'emilie.nuon@socgen.com',
    'alban.a.kosak-ext@socgen.com',
    'rodolphe.poon-ext@socgen.com',
    'laure.tellier@socgen.com',
  ];
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
      EAC: Object.freeze({
        NAME: 'EAC',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique EAC en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
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
      EACFINMOIS: Object.freeze({
        NAME: 'EACFINMOIS',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique EAC FIN MOIS en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
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
      PMD: Object.freeze({
        NAME: 'PMD',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique EAC pour les outsourcings en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
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
      TM: Object.freeze({
        NAME: 'TM',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique de réalisés en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
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
      NOSICA: Object.freeze({
        NAME: 'NOSICA',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique Nosica en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
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
      MYGTS: Object.freeze({
        NAME: 'MYGTS',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique MYGTS en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
        HEADER: ['ClientLongName', '€', 'Code NRG', 'Gamme', 'Sous-Gamme', 'Mois'],
      }),
      LICENCE_MAINTENANCE: Object.freeze({
        NAME: 'LICENCE_MAINTENANCE',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique LICENCE_MAINTENANCE en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
        HEADER: [
          'year',
          'accounting_period',
          'guichet_code',
          'organization_code',
          'conversion_code',
          'code_ledger',
          'insert_date',
          'PCI',
          'NRG_code',
          'CDS',
          'CSM',
          'Payor',
          'amount_final_by_csm_partner',
          'amount_initial_nosica',
          'total_cost_by_NRG_CDS',
          'expense_ratio',
        ],
      }),
      NOSICAPRD: Object.freeze({
        NAME: 'NOSICAPRD',
        ORIGIN_SEPARATOR: '|@|',
        SEPARATOR: ';',
        EMAIL_TO: [...this.defaultEmailTo],
        EMAIL_SUBJECT: `Lignes rejetées suite à votre import automatique NOSICA vision produit en ${process.env.NODE_ENV || 'development'}`,
        EMAIL_BODY: `Bonjour,<br > Suite à votre import automatique,
        vous trouverez un export des lignes rejetées.
        La cause de rejet est ajoutée au bout de chaque ligne(la colonne <b>error</b>).
        <br > Cordialement,
        <br > L'equipe GPC.`,
        HEADER: ['PRD : Libellé CA Prestataire', 'RFI - Numero Rubrique FI', 'RFI - Libelle Rubrique FI', 'PRD : Facture du mois'],
      }),
    }),
    S3_BUCKET: 'bsc-fin-fpm-gpc-a2870-',
  });

  public ACTIVIT_THIRDPARTY_KEYS = ['startDate', 'endDate', 'thirdPartyPercentages', 'activity'];
}
