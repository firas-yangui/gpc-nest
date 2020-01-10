import { Workload } from './workload.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(Workload)
export class WorkloadRepository extends Repository<Workload> {}
