import { appendFileSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';


@Injectable()
export class ImportRejectionsHandlerService {
  private readonly logger = new Logger(ImportRejectionsHandlerService.name);
  constructor() {}
  append (filename: string, line: string) {
    try {
      appendFileSync(`/tmp/${filename}.REJECTED`, line + '\r\n');
    } catch (err) {
      this.logger.error(`Error append rejection: ${err}`);
    }
  }
}
