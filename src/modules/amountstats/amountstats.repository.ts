import { AmountStat } from './amountstat.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(AmountStat)
export class AmountStatRepository extends Repository<AmountStat> {}
