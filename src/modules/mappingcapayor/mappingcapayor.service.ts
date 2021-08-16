import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MappingCaPayorRepository } from './mappingcapayor.repository';
import { MappingCaPayor } from './mappingcapayor.entity';
@Injectable()
export class MappingCaPayorService {
  constructor(
    @InjectRepository(MappingCaPayorRepository)
    private mappingCaPayorRepository: MappingCaPayorRepository,
  ) {}

  getMappingCaPayor() {
    return this.mappingCaPayorRepository.find();
  }

  async setMappingCaPayor(newMappingCaPayor: MappingCaPayor[]) {
    await this.mappingCaPayorRepository.clear();

    return await this.mappingCaPayorRepository.insert(newMappingCaPayor);
  }
}
