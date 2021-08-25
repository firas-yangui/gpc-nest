import { Repository, EntityRepository } from 'typeorm';
import { Activity } from './activity.entity';

@EntityRepository(Activity)
export class ActivityRepository extends Repository<Activity> {}
