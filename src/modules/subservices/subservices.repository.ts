import { SubService } from './subservice.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(SubService)
export class SubServiceRepository extends Repository<SubService> {}
