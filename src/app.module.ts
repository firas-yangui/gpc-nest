import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './modules/healthcheck/terminus-options.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { SgConnectModule, SgConnectOptions } from '@societe-generale/nestjs-sg-connect';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { typeOrmConfig } from './config/typeorm.config';
import { UserModule } from './modules/user/user.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { AmountsModule } from './modules/amounts/amounts.module';
import { WorkloadsModule } from './modules/workloads/workloads.module';
import { SubnatureModule } from './modules/subnature/subnature.module';
import { ThirdpartiesModule } from './modules/thirdparties/thirdparties.module';
import { SubtypologiesModule } from './modules/subtypologies/subtypologies.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks.module';
import { PyramidModule } from './modules/tasks/pyramid/pyramid.module';

import DbLoader from './loader';

const options: SgConnectOptions = {
  sgConnectUrl: process.env.SG_CONNECT_ENDPOINT,
  debug: false,
};

/**
 * This is the main application module, which imports all the other modules.
 */
@Module({
  imports: [
    TypeOrmModule.forRoot(DbLoader),
    ConfigurationModule,
    SgConnectModule.register(options),
    TerminusModule.forRootAsync({
      useClass: TerminusOptionsService,
    }),
    EmployeesModule,
    UserModule,
    NotificationsModule,
    TransactionModule,
    PeriodsModule,
    AmountsModule,
    WorkloadsModule,
    SubnatureModule,
    ThirdpartiesModule,
    SubtypologiesModule,
    ScheduleModule.forRoot(),
    //TasksModule,
  ],
})
export class AppModule {}
