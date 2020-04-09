import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ServiceRepository } from './../services/services.repository';
import { Service } from './../interfaces/common-interfaces';
@Injectable()
export class ServicesService {
  constructor(
    @InjectRepository(ServiceRepository)
    private serviceRepository: ServiceRepository,
  ) {}

  async find(options: object = {}): Promise<Service[]> {
    return await this.serviceRepository.find(options);
  }
}
