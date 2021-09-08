import { ActivityThirdParty } from './activity-thirdparty.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(ActivityThirdParty)
export class ActivityThirdPartyRepository extends Repository<ActivityThirdParty> {}
