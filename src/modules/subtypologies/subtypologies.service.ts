import { Injectable } from '@nestjs/common';
import { SubtypologyRepository } from './subtypologies.repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class SubtypologiesService {
  constructor(
    @InjectRepository(SubtypologyRepository)
    private subtypologyRepository: SubtypologyRepository,
  ) {}
}
