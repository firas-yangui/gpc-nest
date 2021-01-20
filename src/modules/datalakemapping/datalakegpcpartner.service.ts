import { Injectable } from '@nestjs/common';
import { DatalakeGpcPartnerRepository } from './datalakegpcpartner.repository';
import { DatalakeGpcPartner } from './datalakegpcpartner.entity';
import { InjectRepository } from '@nestjs/typeorm';
@Injectable()
export class DatalakeGpcPartnerService {
  constructor(
    @InjectRepository(DatalakeGpcPartnerRepository)
    private datalakeGpcPartnerRepository: DatalakeGpcPartnerRepository,
  ) {}
  async findOne(options: object = {}): Promise<DatalakeGpcPartner> {
    return await this.datalakeGpcPartnerRepository.findOne(options);
  }
}
