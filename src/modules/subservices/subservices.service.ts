import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubServiceRepository } from './subservices.repository';
import { SubService } from './../interfaces/common-interfaces';

@Injectable()
export class SubservicesService {
  constructor(
    @InjectRepository(SubServiceRepository)
    private subServiceRepository: SubServiceRepository,
  ) {}

  async find(options: object = {}): Promise<SubService[]> {
    return await this.subServiceRepository.find(options);
  }

  async findOne(id: number | string, options: object = {}): Promise<SubService> {
    return await this.subServiceRepository.findOne(id, options);
  }
}