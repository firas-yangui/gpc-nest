import { Module, Global } from '@nestjs/common';
import { Helpers } from './helpers';

@Global()
@Module({
  imports: [],
  providers: [Helpers],
  exports: [Helpers],
})
export class GlobalServicesModule {}
