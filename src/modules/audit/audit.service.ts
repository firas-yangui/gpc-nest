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

  async find(query): Promise<Audit[]> {
    const options: { [key: string]: any } = {};

    if (query.userId) options.where.user.id = query.userId;
    if (query.take) {
      options.order.id = 'DESC';
      options.take = query.take;
    }
    if (query.skip) {
      options.order.id = 'DESC';
      options.skip = query.skip;
    }

    return await this.auditRepository.find(options);
  }

  async findOne(options: object = {}): Promise<Audit> {
    return await this.auditRepository.findOne(options);
  }

  async save(audit): Promise<Audit> {
    return await this.auditRepository.save(audit);
  }
}
