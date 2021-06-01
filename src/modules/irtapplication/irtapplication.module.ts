import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IrtApplicationRepository } from './irtapplication.repository';
import { IrtApplicationController } from './irtapplication.controller';
import { IrtApplicationService } from './irtapplication.service';

@Module({
  imports: [TypeOrmModule.forFeature([IrtApplicationRepository])],
  controllers: [IrtApplicationController],
  providers: [IrtApplicationService],
  exports: [IrtApplicationService],
})
export class IrtApplicationModule {}
