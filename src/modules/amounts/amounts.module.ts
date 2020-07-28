import { Module } from '@nestjs/common';
import { AmountsController } from './amounts.controller';
import { AmountsService } from './amounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountRepository } from './amounts.repository';
import { AmountConverter } from './amounts.converter';
import { ConstantsModule } from './../constants/constants.module';

@Module({
  imports: [TypeOrmModule.forFeature([AmountRepository]), ConstantsModule],
  controllers: [AmountsController],
  providers: [AmountsService, AmountConverter],
  exports: [AmountsService, AmountConverter],
})
export class AmountsModule {}
