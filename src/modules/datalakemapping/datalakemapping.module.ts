import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DatalakeGpcOrganizationService } from './datalakegpcorganization.service';
import { DatalakeGpcOrganizationRepository } from './datalakegpcorganization.repository';

@Module({
  imports: [TypeOrmModule.forFeature([DatalakeGpcOrganizationRepository])],
  providers: [DatalakeGpcOrganizationService],
  exports: [DatalakeGpcOrganizationService],
})
export class DatalakeMappingModule {}
