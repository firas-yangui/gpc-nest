import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './modules/healthcheck/terminus-options.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { SgConnectModule, SgConnectOptions } from '@societe-generale/nestjs-sg-connect';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';

const options: SgConnectOptions = {
  sgConnectUrl: process.env.SG_CONNECT_ENDPOINT,
  debug: false,
};

/**
 * This is the main application module, which imports all the other modules.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(typeOrmConfig),
    ConfigurationModule,
    SgConnectModule.register(options),
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    EmployeesModule,
  ],
})
export class AppModule {}
