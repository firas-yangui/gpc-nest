import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { TerminusOptionsService } from './modules/healthcheck/terminus-options.service';
import { EmployeesModule } from './modules/employees/employees.module';
import { TransactionModule } from './modules/transactions/transaction.module';
import { SgConnectModule, SgConnectOptions } from '@societe-generale/nestjs-sg-connect';
import { ConfigurationModule } from './modules/configuration/configuration.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from './modules/user/user.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { PeriodsModule } from './modules/periods/periods.module';
import { AmountsModule } from './modules/amounts/amounts.module';
import { WorkloadsModule } from './modules/workloads/workloads.module';
import { SubnatureModule } from './modules/subnature/subnature.module';
import { ThirdpartiesModule } from './modules/thirdparties/thirdparties.module';
import { SubtypologiesModule } from './modules/subtypologies/subtypologies.module';
import { SubtypologyAppSettingsModule } from './modules/subTypologyAppSettings/subtypologyappsettings.module';
import { ScheduleModule } from '@nestjs/schedule';
import { TasksModule } from './modules/tasks/tasks-manager.module';
import { SchedulerModule } from './modules/scheduler/scheduler.module';
import { GlobalServicesModule } from './services/global-services.module';
import { ConstantsModule } from './modules/constants/constants.module';

import DbLoader from './loader';

const options: SgConnectOptions = {
  sgConnectUrl: process.env.SG_CONNECT_ENDPOINT,
  debug: false,
};

/**
 * This is the main application module, which imports all the other modules.
 */

const applicationModules = [
  TypeOrmModule.forRoot(DbLoader),
  ConfigurationModule,
  ConstantsModule,
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
  SubtypologyAppSettingsModule,
  GlobalServicesModule,
  ScheduleModule.forRoot(),
];

if (process.env.TASKS_MODULE_ENABLED) {
  applicationModules.push(TasksModule);
}

if (process.env.SCHEDULER_MODULE_ENABLED) {
  applicationModules.push(SchedulerModule);
}

@Module({
  imports: applicationModules,
})
export class AppModule {}
