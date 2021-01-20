import { Injectable } from '@nestjs/common';
import { DatalakeGpcOrganizationRepository } from './datalakegpcorganization.repository';
import { DatalakeGpcOrganization } from './datalakegpcorganization.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DatalakeGpcOrganizationService {
  constructor(
    @InjectRepository(DatalakeGpcOrganizationRepository)
    private datalakeGpcOrganizationRepository: DatalakeGpcOrganizationRepository,
  ) {}
  async findOne(options: object = {}): Promise<DatalakeGpcOrganization> {
    return await this.datalakeGpcOrganizationRepository.findOne(options);
  }
}
