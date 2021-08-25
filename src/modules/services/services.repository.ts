import { ServiceDto } from './services.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(ServiceDto)
export class ServiceRepository extends Repository<ServiceDto> {}
