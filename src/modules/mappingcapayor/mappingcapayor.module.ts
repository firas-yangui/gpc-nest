import { Module } from '@nestjs/common';
import { MappingCaPayorController } from './mappingcapayor.controller';
import { MappingCaPayorService } from './mappingcapayor.service';
import { MappingCaPayorRepository } from './mappingcapayor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([MappingCaPayorRepository])],
  controllers: [MappingCaPayorController],
  providers: [MappingCaPayorService],
  exports: [MappingCaPayorService],
})
export class MappingCaPayorModule {}
