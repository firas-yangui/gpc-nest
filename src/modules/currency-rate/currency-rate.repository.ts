import { CurrencyRate } from './currency-rate.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CurrencyRate)
export class CurrencyRateRepository extends Repository<CurrencyRate> {}
