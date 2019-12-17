import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';
import { SgConnectSwaggerModuleOptions } from '@societe-generale/nestjs-swagger-ui';

export type SwaggerSchemes = ('http' | 'https')[];

export interface SwaggerOptions {
  host?: string;
  schemes?: SwaggerSchemes;
  title: string;
  description: string;
  version: string;
  contactEmail: string;
  externalDocumenttion: string;
  termsOfService: string;
  oAuth2?: {
    flow?: 'implicit' | 'password' | 'application' | 'accessCode';
    authorizationUrl?: string;
    tokenUrl?: string;
    scopes?: object;
  };
  moduleOptions?: SgConnectSwaggerModuleOptions;
}

export interface ApiConfiguration {
  globalPrefix: string;
  port: number;
  swagger?: SwaggerOptions;
  cors?: CorsOptions;
}
