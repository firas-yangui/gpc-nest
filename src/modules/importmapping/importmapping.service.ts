import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ImportMappingRepository } from './importmapping.repository';
import { ImportMapping } from './importmapping.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { createQueryBuilder, Like } from 'typeorm';
import { Thirdparty } from '../thirdparties/thirdparty.entity';
import { SubNature } from '../subnature/subnature.entity';
import { ServiceDto } from '../services/services.entity';

@Injectable()
export class ImportMappingService {
  constructor(
    @InjectRepository(ImportMappingRepository)
    private importMappingRepository: ImportMappingRepository,
  ) {}

  async getMapping(importName: string, mappingName: string, mappedValue: string): Promise<any> {
    const mapping: ImportMapping = await this.importMappingRepository.findOne({ where: { importName, mappingName, mappedValue } });
    if (!mapping) {
      return null;
    }

    const entities = {
      Thirdparty: Thirdparty,
      SubNature: SubNature,
      Service: ServiceDto,
    };

    return await createQueryBuilder()
      .from(entities[mapping.modelName], mapping.modelName.toLocaleLowerCase())
      .select(`${mapping.modelName.toLocaleLowerCase()}`)
      .where(`${mapping.modelName.toLocaleLowerCase()}.${mapping.modelColumn} = :modelvalue`, { modelvalue: mapping.modelValue })
      .getOne();
  }
}
