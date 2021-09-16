import { CaPayor } from './capayor.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(CaPayor)
export class CaPayorRepository extends Repository<CaPayor> {}
