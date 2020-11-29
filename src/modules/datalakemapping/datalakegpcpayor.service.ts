import { Injectable } from '@nestjs/common';
import { DatalakeGpcPayorRepository } from './datalakegpcpayor.repository';
import { DatalakeGpcPayor } from './datalakegpcpayor.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DatalakeGpcPayorService {
  constructor(
    @InjectRepository(DatalakeGpcPayorRepository)
    private datalakeGpcPayorRepository: DatalakeGpcPayorRepository,
  ) {}
  async findOne(options: object = {}): Promise<DatalakeGpcPayor> {
    return await this.datalakeGpcPayorRepository.findOne(options);
  }
}
