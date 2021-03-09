import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SubService } from '../subservices/subservice.entity';
import { ServiceRepository } from './../services/services.repository';
import { Service } from './services.entity';

@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async find(options: object = {}): Promise<Service[]> {
    return await this.serviceRepository.find(options);
  }

  async findOne(options: object = {}): Promise<Service> {
    return await this.serviceRepository.findOne(options);
  }

  async getSubservices(options: { id: number }): Promise<SubService[]> {
    return await (await this.serviceRepository.findOne({ where: { id: options.id }, relations: ['subservices'] })).subservices;
  }

  async findByName(name: string): Promise<Service> {
    return await this.serviceRepository
      .createQueryBuilder()
      .where('LOWER(name) = LOWER(:name)', { name })
      .getOne();
  }
}
