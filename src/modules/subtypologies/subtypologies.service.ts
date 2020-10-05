import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubtypologyRepository } from './subtypologies.repository';
import { Subtypology } from './subtypology.entity';

@Injectable()
export class SubtypologiesService {
  constructor(
    @InjectRepository(SubtypologyRepository)
    private subtypologyRepository: SubtypologyRepository,
  ) {}

  async findOne(options: object = {}): Promise<Subtypology> {
    return await this.subtypologyRepository.findOne(options);
  }
}
