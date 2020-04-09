import { Module } from '@nestjs/common';
import { AmountsController } from './amounts.controller';
import { AmountsService } from './amounts.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AmountRepository } from './amounts.repository';

@Module({
  imports: [TypeOrmModule.forFeature([AmountRepository])],
  controllers: [AmountsController],
  providers: [AmountsService],
  exports: [AmountsService],
})
export class AmountsModule {}
