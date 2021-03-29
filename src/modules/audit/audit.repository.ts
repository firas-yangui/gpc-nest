import { Audit } from './audit.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Audit)
export class AuditRepository extends Repository<Audit> {}
