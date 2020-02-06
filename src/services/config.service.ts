import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as Joi from '@hapi/joi';
import { Injectable } from '@nestjs/common';
import EnvConfigInterface from './../modules/interfaces/common-interfaces';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as path from 'path';

@Injectable()
class ConfigService {
  private readonly envConfig: EnvConfigInterface;

  constructor(filePath: string) {
    const config = dotenv.parse(fs.readFileSync(filePath));
    this.envConfig = this.validateInput(config);
  }

  public getTypeORMConfig(): TypeOrmModuleOptions {
    const baseDir = path.join(__dirname, '../');
    const entitiesPath = `${baseDir}${this.envConfig.TYPEORM_ENTITIES}`;
    const migrationPath = `${baseDir}${this.envConfig.TYPEORM_MIGRATIONS}`;
    const type: any = this.envConfig.TYPEORM_CONNECTION;
    return {
      type,
      host: this.envConfig.TYPEORM_HOST,
      username: this.envConfig.TYPEORM_USERNAME,
      password: this.envConfig.TYPEORM_PASSWORD,
      database: this.envConfig.TYPEORM_DATABASE,
      port: Number.parseInt(this.envConfig.TYPEORM_PORT, 10),
      logging: false,
      entities: [entitiesPath],
      migrations: [migrationPath],
      migrationsRun: this.envConfig.TYPEORM_MIGRATIONS_RUN === 'true',
      cli: {
        migrationsDir: 'src/db/migrations',
        entitiesDir: 'src/db/entities',
      },
    };
  }

  /*
   Ensures all needed variables are set, and returns the validated JavaScript object
   including the applied default values.
  */
  private validateInput(envConfig: EnvConfigInterface): EnvConfigInterface {
    const envVarsSchema: Joi.ObjectSchema = Joi.object({
      NODE_ENV: Joi.string()
        .valid('development', 'homol')
        .default('development'),
      HTTP_PORT: Joi.number().required(),
    }).unknown(true);

    const { error, value: validatedEnvConfig } = envVarsSchema.validate(envConfig);
    if (error) {
      throw new Error(`Config validation error: ${error.message}`);
    }
    return validatedEnvConfig;
  }
}

export default ConfigService;
