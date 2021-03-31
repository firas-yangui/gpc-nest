import { Module } from '@nestjs/common';
import { ImportRejectionsHandlerService } from './import-rejections-handler.service';

@Module({
  imports: [],
  controllers: [],
  providers: [ImportRejectionsHandlerService],
  exports: [ImportRejectionsHandlerService],
})
export class ImportRejectionsHandlerModule {}
