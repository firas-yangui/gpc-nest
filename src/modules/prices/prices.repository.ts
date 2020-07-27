import { Price } from './prices.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Price)
export class PriceRepository extends Repository<Price> {}
