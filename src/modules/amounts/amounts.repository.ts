import { Amount } from './amount.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Amount)
export class AmountRepository extends Repository<Amount> {}
