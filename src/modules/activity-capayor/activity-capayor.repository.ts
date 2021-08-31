import { ActivityCapayor } from './activity-capayor.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(ActivityCapayor)
export class ActivityCapayorRepository extends Repository<ActivityCapayor> {}
