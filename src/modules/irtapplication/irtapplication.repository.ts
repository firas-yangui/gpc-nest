import { IrtApplication } from './irtapplication.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(IrtApplication)
export class IrtApplicationRepository extends Repository<IrtApplication> {}
