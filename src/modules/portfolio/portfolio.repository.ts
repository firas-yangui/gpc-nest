import { Portfolio } from './portfolio.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Portfolio)
export class PortfolioRepository extends Repository<Portfolio> {}
