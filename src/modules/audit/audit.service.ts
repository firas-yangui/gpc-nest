import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditRepository } from './audit.repository';
import { Audit } from './audit.entity';
import { getManager } from 'typeorm';

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditRepository)
    private auditRepository: AuditRepository,
  ) {}

  async find(query): Promise<Audit[]> {
    try {
      const dbQuery = getManager()
        .createQueryBuilder()
        .from(Audit, 'audit')
        .select('audit')
        .innerJoin('audit.user', 'user');

      if (query.userId) dbQuery.where('user.id = :userId', { userId: +query.userId });

      return await dbQuery.getMany();
    } catch (err) {
      Logger.error(err);
      return [];
    }
  }

  async findOne(options: object = {}): Promise<Audit> {
    return await this.auditRepository.findOne(options);
  }

  async save(audit): Promise<Audit> {
    return await this.auditRepository.save(audit);
  }
}
