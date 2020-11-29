import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatalakeGpcOrganizationService } from './datalakegpcorganization.service';
import { DatalakeGpcPartnerService } from './datalakegpcpartner.service';
import { DatalakeGpcPayorService } from './datalakegpcpayor.service';
import { DatalakeGpcOrganizationRepository } from './datalakegpcorganization.repository';
import { DatalakeGpcPartnerRepository } from './datalakegpcpartner.repository';
import { DatalakeGpcPayorRepository } from './datalakegpcpayor.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DatalakeGpcOrganizationRepository, DatalakeGpcPartnerRepository, DatalakeGpcPayorRepository])],
  providers: [DatalakeGpcOrganizationService, DatalakeGpcPartnerService, DatalakeGpcPayorService],
  exports: [DatalakeGpcOrganizationService, DatalakeGpcPartnerService, DatalakeGpcPayorService],
})
export class DatalakeMappingModule {}
