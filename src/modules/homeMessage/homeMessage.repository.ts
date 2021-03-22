import { HomeMessage } from './homeMessage.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(HomeMessage)
export class HomeMessageRepository extends Repository<HomeMessage> {}
