import { Thirdparty } from './thirdparty.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Thirdparty)
export class ThirdpartyRepository extends Repository<Thirdparty> {}
