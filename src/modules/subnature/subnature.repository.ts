import { SubNature } from './subnature.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(SubNature)
export class SubNatureRepository extends Repository<SubNature> {}
