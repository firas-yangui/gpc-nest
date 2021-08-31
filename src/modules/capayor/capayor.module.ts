import { Module } from '@nestjs/common';
import { CaPayorController } from './capayor.controller';
import { CaPayorService } from './capayor.service';
import { CaPayorRepository } from './capayor.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CaPayorRepository])],
  controllers: [CaPayorController],
  providers: [CaPayorService],
  exports: [CaPayorService],
})
export class CaPayorModule {}
