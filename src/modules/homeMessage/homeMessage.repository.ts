import { HomeMessageEntity } from './homeMessage.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(HomeMessageEntity)
export class HomeMessageRepository extends Repository<HomeMessageEntity> {}
