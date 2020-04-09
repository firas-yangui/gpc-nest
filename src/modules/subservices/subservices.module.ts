import { Module } from '@nestjs/common';
import { SubservicesController } from './subservices.controller';
import { SubservicesService } from './subservices.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SubServiceRepository } from './subservices.repository';

@Module({
  imports: [TypeOrmModule.forFeature([SubServiceRepository])],
  controllers: [SubservicesController],
  providers: [SubservicesService],
  exports: [SubservicesService],
})
export class SubservicesModule {}
