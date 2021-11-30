import { EntityRepository, Repository } from 'typeorm';
import { ActivityDomain } from './activity-domain.entity';

@EntityRepository(ActivityDomain)
export class ActivityDomainRepository extends Repository<ActivityDomain> {}
