import { DatalakeGpcOrganization } from './datalakegpcorganization.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DatalakeGpcOrganization)
export class DatalakeGpcOrganizationRepository extends Repository<DatalakeGpcOrganization> {}
