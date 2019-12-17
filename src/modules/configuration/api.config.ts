import { ApiConfiguration } from './configuration.interfaces';
import { toSchemes } from './configuration.utils';

// This file centralizes the global configuration of the API.
// Configuration that depends on the environment (dev, uat, prod...) must be taken
// from environment variables (process.env.XXX)

const configuration: ApiConfiguration = {
  globalPrefix: 'api/v1',
  port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT, 10) : 9999,
  // ----------------------------------
  // NestJS swagger configuration
  // https://docs.nestjs.com/recipes/swagger
  // ----------------------------------
  swagger: {
    host: process.env.SWAGGER_HOST,
    schemes: toSchemes(process.env.SWAGGER_SCHEMES),
    title: 'NestJS whiteApp',
    description: 'NestJS whiteApp API producer',
    version: '1.0',
    contactEmail: 'example@socgen.com',
    externalDocumenttion: '',
    termsOfService: 'Internal usage',
    oAuth2: {
      flow: 'implicit',
      authorizationUrl: `${process.env.SG_CONNECT_ENDPOINT}/oauth2/authorize`,
    },
    // ----------------------------------
    // Swagger-ui configuration
    // https://sgithub.fr.world.socgen/sg-devx/nestjs-api-modules/tree/master/%40sg-nestjs/nestjs-swagger-ui
    // ----------------------------------
    moduleOptions: {
      path: process.env.SWAGGER_PATH,
      sgConnect: {
        authorizationEndpoint: process.env.SG_CONNECT_ENDPOINT,
        clientId: process.env.SWAGGER_CLIENT_ID,
        scopes: process.env.SWAGGER_SCOPES,
      },
    },
  },
  // ----------------------------------
  // CORS configuration
  // ----------------------------------
  cors: {
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    preflightContinue: false,
    optionsSuccessStatus: 204,
    allowedHeaders: [
      'Accept',
      'Authorization',
      'Cache-Control',
      'Content-Type',
      'If-Modified-Since',
      'Origin',
      'Pragma',
      'X-Data-Count',
      'X-Requested-With',
    ],
  },
};

export default configuration;
