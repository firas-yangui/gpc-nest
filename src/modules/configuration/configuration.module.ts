import { Module } from '@nestjs/common';
import { ConfigurationService } from './configuration.service';

import apiConfig from './api.config';

@Module({
  exports: [ConfigurationService],
  providers: [
    {
      provide: ConfigurationService,
      useValue: new ConfigurationService(apiConfig),
    },
  ],
})
export class ConfigurationModule {}
