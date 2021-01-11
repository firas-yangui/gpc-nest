import { DatalakeGpcPayor } from './datalakegpcpayor.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(DatalakeGpcPayor)
export class DatalakeGpcPayorRepository extends Repository<DatalakeGpcPayor> {}
