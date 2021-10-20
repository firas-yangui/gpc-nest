import { Repository, EntityRepository, getManager } from 'typeorm';
import { MyView } from './my-view.entity';
import { ServiceDto } from '../services/services.entity';

@EntityRepository(MyView)
export class MyViewRepository extends Repository<MyView> {}
