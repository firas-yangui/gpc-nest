import { DatalakeGpcPartner } from './datalakegpcpartner.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DatalakeGpcPartner)
export class DatalakeGpcPartnerRepository extends Repository<DatalakeGpcPartner> {}
