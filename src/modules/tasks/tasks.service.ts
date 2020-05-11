import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { NosicaParser } from './nosica/nosica.parser';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);
  constructor(private readonly nosicaParser: NosicaParser) {}

  @Cron('*/10 * * * * *')
  handleCron() {
    this.logger.debug(`Called each second ${new Date()}`);
    this.nosicaParser.parseNosicaFile(`${__dirname}/../../../received-files/`);
  }
}
