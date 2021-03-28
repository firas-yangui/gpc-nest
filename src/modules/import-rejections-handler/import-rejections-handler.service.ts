import { appendFileSync } from 'fs';
import { Injectable, Logger } from '@nestjs/common';
import { existsSync } from 'fs';
import { parse } from 'json2csv';

@Injectable()
export class ImportRejectionsHandlerService {
  private readonly logger = new Logger(ImportRejectionsHandlerService.name);
  async append(filename: string, data: any): Promise<any> {
    try {
      const file = `/tmp/${filename}.REJECTED.csv`;
      let options: any = { delimiter: ';' };
      if (existsSync(file)) {
        options = { ...options, header: false };
      }
      const line = parse(data, options);
      return appendFileSync(file, line + '\r\n');
    } catch (err) {
      this.logger.error(`Error append rejection: ${err}`);
    }
  }
}
