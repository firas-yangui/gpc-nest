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
import { DatalakeMappingModule } from './modules/datalakemapping/datalakemapping.module';
import { HomeMessageModule } from './modules/homeMessage/homeMessage.module';
import { ImportRejectionsHandlerModule } from './modules/import-rejections-handler/import-rejections-handler.module';
import { MailerModule, MailerOptions } from '@nestjs-modules/mailer';
import { AmountStatsModule } from './modules/amountstats/amountstats.module';
import { IrtApplicationModule } from './modules/irtapplication/irtapplication.module';

import DbLoader from './loader';

const options: SgConnectOptions = {
  sgConnectUrl: process.env.SG_CONNECT_ENDPOINT,
  debug: false,
};

const mailerOptions: MailerOptions = {
  transport: {
    host: process.env.MAILER_HOST,
    port: process.env.MAILER_PORT,
    ignoreTLS: true,
  },
  defaults: {
    from: '"noreply" <noreply@nestjs.com>',
  },
  template: {
    options: {
      strict: true,
    },
  },
};

/**
 * This is the main application module, which imports all the other modules.
 */

@Module({
  imports: [
    TypeOrmModule.forRoot(DbLoader),
    ScheduleModule.forRoot(),
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
    AmountStatsModule,
    WorkloadsModule,
    SubnatureModule,
    ThirdpartiesModule,
    SubtypologiesModule,
    SubtypologyAppSettingsModule,
    GlobalServicesModule,
    ScheduleModule.forRoot(),
    DatalakeMappingModule,
    HomeMessageModule,
    ImportRejectionsHandlerModule,
    MailerModule.forRoot(mailerOptions),
    TasksModule,
    SchedulerModule,
    AmountStatsModule,
    IrtApplicationModule,
  ],
})
export class AppModule {}
