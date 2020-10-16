import { Module } from '@nestjs/common';
import { RawAmountsService } from './rawamounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RawAmountRepository } from './rawamounts.repository';
import { ConstantsModule } from './../constants/constants.module';
@Module({
  imports: [TypeOrmModule.forFeature([RawAmountRepository]), ConstantsModule],
  controllers: [],
  providers: [RawAmountsService],
  exports: [RawAmountsService],
})
export class RawAmountsModule {}
