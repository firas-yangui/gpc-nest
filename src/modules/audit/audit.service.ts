import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditRepository } from './audit.repository';
import { Audit } from './audit.entity';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditRepository)
    private auditRepository: AuditRepository,
  ) {}

  async find(options: object = {}): Promise<Audit[]> {
    return await this.auditRepository.find(options);
  }

  async findOne(options: object = {}): Promise<Audit> {
    return await this.auditRepository.findOne(options);
  }

  async save(audit): Promise<Audit> {
    return await this.auditRepository.save(audit);
  }
}
