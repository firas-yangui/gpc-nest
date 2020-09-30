import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubsidiaryAllocationRepository } from './subsidiaryallocation.repository';
import { SubsidiaryAllocation } from './subsidiaryallocation.entity';

@Injectable()
export class SubsidiaryallocationService {
  constructor(
    @InjectRepository(SubsidiaryAllocationRepository)
    private subsidiaryAllocationRepository: SubsidiaryAllocationRepository,
  ) {}

  async findOne(options: object = {}): Promise<SubsidiaryAllocation> {
    return await this.subsidiaryAllocationRepository.findOne(options);
  }

  async find(options: object = {}): Promise<SubsidiaryAllocation[]> {
    return await this.subsidiaryAllocationRepository.find(options);
  }
}
