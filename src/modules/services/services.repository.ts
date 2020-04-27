import { Service } from './services.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Service)
export class ServiceRepository extends Repository<Service> {}
