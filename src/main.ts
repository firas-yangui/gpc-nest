import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SgConnectSwaggerModule, SgConnectSwaggerModuleOptions } from '@societe-generale/nestjs-swagger-ui';
import { ConfigurationService } from './modules/configuration/configuration.service';
import { AppModule } from './app.module';

const noCache: express.RequestHandler = (_, res, next) => {
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  next();
};
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigurationService);

  // All api endpoints will be prefixed with "/api/v1"
  const apiGlobalPrefix = config.getGlobalPrefix();
  app.setGlobalPrefix(apiGlobalPrefix);

  // CORS configuration
  app.enableCors({
    ...config.getCorsOptions(),
  });

  app.use(noCache);

  // Swagger configuration
  // const swaggerConfig = config.getSwaggerOptions();
  // const options = new DocumentBuilder()
  //     .setTitle(swaggerConfig.title)
  //     .setDescription(swaggerConfig.description)
  //     .setVersion(swaggerConfig.version)
  //     .setContactEmail(swaggerConfig.contactEmail)
  //     .setTermsOfService(swaggerConfig.termsOfService)
  //     .setSchemes(...swaggerConfig.schemes)
  //     .setHost(swaggerConfig.host)
  //     .addOAuth2(swaggerConfig.oAuth2.flow, swaggerConfig.oAuth2.authorizationUrl, swaggerConfig.oAuth2.tokenUrl, swaggerConfig.oAuth2.scopes) // Implicit workflow
  //     .build();

  // const document = SwaggerModule.createDocument(app, options);
  // SgConnectSwaggerModule.setup(app, document, swaggerConfig.moduleOptions);

  //nestjs swagger config
  const swaggerConfig = config.getSwaggerOptions();
  const options = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .setTermsOfService(swaggerConfig.termsOfService)
    .addSecurity('SG Connect', {
      type: 'oauth2',
      description: 'SGConnect implicit flow',
      flows: {
        implicit: {
          authorizationUrl: process.env.SG_CONNECT_ENDPOINT,
          scopes: {
            mail: 'User email',
            openid: 'OpenIDConnect',
            profile: 'User Profile',
            'api.gpc-workload-management.v1': 'GPC Workflow API',
          },
        },
      },
    })
    .build();

  const document = SwaggerModule.createDocument(app, options, {
    operationIdFactory: (controllerKey, methodKey) => methodKey,
  });
  SwaggerModule.setup('docs', app, document);

  //SgConnect Swagger Config

  const moduleOptions: SgConnectSwaggerModuleOptions = {
    path: '/swagger/',
    jsonPath: 'swagger.json',
    sgConnect: {
      authorizationEndpoint: process.env.SG_CONNECT_ENDPOINT,
      clientId: process.env.SWAGGER_CLIENT_ID,
      scopes: process.env.SWAGGER_SCOPES,
      redirectUri: process.env.SWAGGER_REDIRECT_URI,
    },
  };
  // eslint-disable-next-line no-console
  console.log(moduleOptions);
  SgConnectSwaggerModule.setup(app as any, document, moduleOptions);

  const serverPort = config.getPort();
  app.listen(serverPort);
}

bootstrap();
