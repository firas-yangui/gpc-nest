import { Module, Global } from '@nestjs/common';
import { Helpers } from './helpers';
import { MomentFerieManager } from './moment-ferie-manager';

@Global()
@Module({
  imports: [],
  providers: [Helpers, MomentFerieManager],
  exports: [Helpers, MomentFerieManager],
})
export class GlobalServicesModule {}
