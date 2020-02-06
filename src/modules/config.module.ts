import { Global, Module } from '@nestjs/common';
import ConfigService from './../services/config.service';

@Global()
@Module({
  providers: [
    {
      provide: ConfigService,
      useValue: new ConfigService(`/${__dirname}/../../env/${process.env.NODE_ENV || 'development'}.env`),
    },
  ],
  exports: [ConfigService],
})
export default class ConfigModule {}
