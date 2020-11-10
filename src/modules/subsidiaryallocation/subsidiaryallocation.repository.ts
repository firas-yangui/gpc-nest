import { SubsidiaryAllocation } from './subsidiaryallocation.entity';
import { Repository, EntityRepository } from 'typeorm';

@EntityRepository(SubsidiaryAllocation)
export class SubsidiaryAllocationRepository extends Repository<SubsidiaryAllocation> {}
