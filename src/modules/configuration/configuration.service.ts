import { Injectable } from '@nestjs/common';

import { ApiConfiguration, SwaggerOptions } from './configuration.interfaces';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

@Injectable()
export class ConfigurationService {
  private configuration: ApiConfiguration;

  constructor(configuration: ApiConfiguration) {
    this.configuration = configuration;
  }
  get(key: string, defaultValue?: string): string | undefined {
    return typeof process.env[key] !== 'undefined' ? process.env[key] : defaultValue;
  }

  getPort(): number {
    return this.configuration.port;
  }

  getGlobalPrefix(): string {
    return this.configuration.globalPrefix;
  }

  getSwaggerOptions(): SwaggerOptions {
    return this.configuration.swagger;
  }

  getCorsOptions(): CorsOptions {
    return this.configuration.cors;
  }
}
