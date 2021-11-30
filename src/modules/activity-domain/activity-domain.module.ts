import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivityDomainRepository } from './activity-domain.repository';
import { ActivityDomainController } from './activity-domain.controller';
import { ActivityDomainService } from './activity-domain.service';

@Module({
  imports: [TypeOrmModule.forFeature([ActivityDomainRepository])],
  controllers: [ActivityDomainController],
  providers: [ActivityDomainService],
  exports: [ActivityDomainService],
})
export class ActivityDomainModule {}
