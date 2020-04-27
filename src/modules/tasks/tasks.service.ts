import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { CsvParser } from './nosica/csv.parser';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly csvParser: CsvParser) {}

  @Cron('*/10 * * * * *')
  handleCron() {
    this.logger.debug(`Called each second ${new Date()}`);
    this.csvParser.parseNosicaFile(`${__dirname}/../../../received-files/`);
  }
}
