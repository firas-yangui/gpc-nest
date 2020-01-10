import { Period } from './period.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Period)
export class PeriodRepository extends Repository<Period> {}
