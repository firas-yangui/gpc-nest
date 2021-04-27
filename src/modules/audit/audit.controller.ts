import { Controller, Get, HttpException, HttpStatus, Logger, Param, Query } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiUseTags } from '@nestjs/swagger';
import { Audit } from './audit.entity';

@Controller('audit')
@ApiUseTags('Audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  find(@Query() query): Promise<Audit[]> {
    Logger.log('Find audits ' + JSON.stringify(query), 'AuditController');
    return this.auditService.find(query);
  }
}
