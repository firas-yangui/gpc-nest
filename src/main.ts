import * as express from 'express';
import { NestFactory } from '@nestjs/core';
import 'reflect-metadata';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { SgConnectSwaggerModule } from '@societe-generale/nestjs-swagger-ui';
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

  const serverPort = config.getPort();
  app.listen(serverPort);

  // Swagger configuration
  const swaggerConfig = config.getSwaggerOptions();
  const options = new DocumentBuilder()
    .setTitle(swaggerConfig.title)
    .setDescription(swaggerConfig.description)
    .setVersion(swaggerConfig.version)
    .setContactEmail(swaggerConfig.contactEmail)
    .setTermsOfService(swaggerConfig.termsOfService)
    .setSchemes(...swaggerConfig.schemes)
    .setHost(swaggerConfig.host)
    .addOAuth2(swaggerConfig.oAuth2.flow, swaggerConfig.oAuth2.authorizationUrl, swaggerConfig.oAuth2.tokenUrl, swaggerConfig.oAuth2.scopes) // Implicit workflow
    .build();
  const document = SwaggerModule.createDocument(app, options);
  SgConnectSwaggerModule.setup(app, document, swaggerConfig.moduleOptions);
}
bootstrap();
