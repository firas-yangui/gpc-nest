import { Module } from '@nestjs/common';
import { ConstantService } from './constants';

@Module({
  imports: [],
  providers: [ConstantService],
  exports: [ConstantService],
})
export class ConstantsModule {}
