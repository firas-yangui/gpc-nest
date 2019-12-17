import { Module } from '@nestjs/common';
import { TerminusOptionsService } from './terminus-options.service';

@Module({
  imports: [],
  providers: [TerminusOptionsService],
  exports: [],
})
export class HealthModule {}
