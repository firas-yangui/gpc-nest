import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { SubservicesController } from './subservices.controller';
import { SubservicesService } from './subservices.service';
import { SubServiceRepository } from './subservices.repository';
import { AuditModule } from '../audit/audit.module';
import { UserModule } from '../user/user.module';

@Module({
  imports: [TypeOrmModule.forFeature([SubServiceRepository]), AuditModule, UserModule],
  controllers: [SubservicesController],
  providers: [SubservicesService],
  exports: [SubservicesService],
})
export class SubservicesModule {}
