import { ImportMapping } from './importmapping.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(ImportMapping)
export class ImportMappingRepository extends Repository<ImportMapping> {}
