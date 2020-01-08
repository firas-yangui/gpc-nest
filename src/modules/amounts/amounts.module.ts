import { Module } from '@nestjs/common';
import { AmountsController } from './amounts.controller';
import { AmountsService } from './amounts.service';

@Module({
  controllers: [AmountsController],
  providers: [AmountsService]
})
export class AmountsModule {}
