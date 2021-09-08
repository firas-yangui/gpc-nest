import { MappingCaPayor } from './mappingcapayor.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(MappingCaPayor)
export class MappingCaPayorRepository extends Repository<MappingCaPayor> {}
