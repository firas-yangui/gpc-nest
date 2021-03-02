import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubNature } from './subnature.entity';
import { SubNatureRepository } from './subnature.repository';
@Injectable()
export class SubnatureService {
  constructor(
    @InjectRepository(SubNatureRepository)
    private subNatureRepository: SubNatureRepository,
  ) {}

  async find(options: object = {}): Promise<SubNature[]> {
    return await this.subNatureRepository.find(options);
  }

  async findOne(options: object = {}): Promise<SubNature> {
    return await this.subNatureRepository.findOne(options);
  }
}
