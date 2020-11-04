import { RawAmount } from './rawamount.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(RawAmount)
export class RawAmountRepository extends Repository<RawAmount> {}
