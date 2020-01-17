import { Subtypology } from './subtypology.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Subtypology)
export class SubtypologyRepository extends Repository<Subtypology> {}
