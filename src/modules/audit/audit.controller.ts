import { Controller, Get, HttpException, HttpStatus, Param } from '@nestjs/common';
import { AuditService } from './audit.service';
import { ApiUseTags } from '@nestjs/swagger';
import { Audit } from './audit.entity';

@Controller('audit')
@ApiUseTags('Audit')
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get()
  findAll(): Promise<Audit[]> {
    return this.auditService.find({});
  }

  @Get(':id')
  async findById(@Param('id') id: number): Promise<Audit> {
    return this.auditService.findOne({ id }).catch(err => {
      throw new HttpException(err, HttpStatus.BAD_REQUEST);
    });
  }
}
