import { ApiProperty } from '@nestjs/swagger';
import { WorkloadExportPeriodAmountsDTO } from './workload-export-period-amounts.dto';

export class WorkloadExportDataItemDTO {
  @ApiProperty() workload_id: string;
  @ApiProperty() workload_name: string;
  @ApiProperty() workload_description: string;
  @ApiProperty() workload_sub_nature_name: string;
  @ApiProperty() workload_sub_nature_code: string;
  @ApiProperty() workload_third_party_name: string;
  @ApiProperty() workload_third_party_trigram: string;
  @ApiProperty() workload_third_party_parent: string;
  @ApiProperty() workload_status: string;
  @ApiProperty() sub_service_id: string;
  @ApiProperty() sub_service_name: string;
  @ApiProperty() sub_service_code: string;
  @ApiProperty() sub_service_priority: string;
  @ApiProperty() sub_service_applicant: string;
  @ApiProperty() sub_service_itmasterplan: string;
  @ApiProperty() sub_service_third_party_name: string;
  @ApiProperty() sub_service_third_party_trigram: string;
  @ApiProperty() service_id: string;
  @ApiProperty() service_name: string;
  @ApiProperty() service_code: string;
  @ApiProperty() service_app_setting_third_party_name: string;
  @ApiProperty() service_app_setting_third_party_trigram: string;
  @ApiProperty() sub_service_sub_typology_plan: string;
  @ApiProperty() sub_service_sub_typology_business_type: string;
  @ApiProperty() sub_service_irt_application_code_irt: string;
  @ApiProperty() sub_service_irt_application_label: string;
  @ApiProperty() workload_third_party_radical: string;
  @ApiProperty() service_app_setting_activity_domain_name: string;
  @ApiProperty() service_app_setting_activity_domain_func_domain: string;
  @ApiProperty() sub_service_phase_english_name: string;
  @ApiProperty() sub_service_project_manager: string;
  @ApiProperty() sub_service_sponsor: string;
  @ApiProperty() sub_service_axis: string;
  @ApiProperty() workload_is_envelop: string;
  @ApiProperty() workload_is_invested: string;
  @ApiProperty() workload_person_in_charge_last_name: string;
  @ApiProperty() workload_person_in_charge_first_name: string;
  @ApiProperty() workload_person_in_charge_bip_code: string;
  @ApiProperty() sub_service_it_responsible: string;
  @ApiProperty() sub_service_business_manager: string;
  @ApiProperty() sub_service_var1: string;
  @ApiProperty() sub_service_var2: string;
  @ApiProperty() sub_service_var3: string;
  @ApiProperty() sub_service_var4: string;
  @ApiProperty() sub_service_var5: string;
  @ApiProperty() sub_service_portfolio_name: string;
  @ApiProperty() sub_service_portfolio_app_setting_sbp: string;
  @ApiProperty() sub_service_program_name: string;
  @ApiProperty() sub_service_program_code: string;
  @ApiProperty() sub_service_cacode: string;
  @ApiProperty() tag: string;

  @ApiProperty({ isArray: true, type: WorkloadExportPeriodAmountsDTO })
  periodAmounts: WorkloadExportPeriodAmountsDTO[];
}
