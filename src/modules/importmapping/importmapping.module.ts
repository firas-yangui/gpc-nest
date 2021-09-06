import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ImportMappingService } from './importmapping.service';
import { ImportMappingRepository } from './importmapping.repository';

@Module({
  imports: [TypeOrmModule.forFeature([ImportMappingRepository])],
  controllers: [],
  providers: [ImportMappingService],
  exports: [ImportMappingService],
})
export class ImportMappingModule {}
