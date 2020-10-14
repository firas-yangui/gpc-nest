import { Module } from '@nestjs/common';
import { RawAmountsService } from './rawamounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawAmountRepository } from './rawamounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([RawAmountRepository])],
  controllers: [],
  providers: [RawAmountsService],
  exports: [RawAmountsService],
})
export class RawAmountsModule {}
