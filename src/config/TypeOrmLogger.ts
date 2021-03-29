import { QueryRunner, Logger } from 'typeorm';
import { Logger as NestjsLogger } from '@nestjs/common';

export class TypeOrmLogger implements Logger {
  logQuery(query: string, parameters?: any[], queryRunner?: QueryRunner) {
    // NestjsLogger.log('Log Query method');
    // NestjsLogger.log(query);
    // NestjsLogger.log(parameters);
    // NestjsLogger.log(queryRunner);
  }
  logQueryError(error: string, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  logQuerySlow(time: number, query: string, parameters?: any[], queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  logSchemaBuild(message: string, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.');
  }
  logMigration(message: string, queryRunner?: QueryRunner) {
    throw new Error('Method not implemented.');
  }

  log(level: 'log' | 'info' | 'warn', message: any, queryRunner?: QueryRunner) {
    // NestjsLogger.log('Log method');
    // NestjsLogger.log(level);
    // NestjsLogger.log(message);
    // NestjsLogger.log(queryRunner);
  }
}
