import { DynamicModule, Module, Global, Provider } from '@nestjs/common';
import { AmqplibService } from './amqplib-wrapper.service';
import { RabbitMQConnectAsyncOptions, RabbitMQOptionsFactory } from './../interfaces/common-interfaces';
import { ConfigService } from './../../config/rabbitmq-config.service';

@Global()
@Module({})
export class AmqplibWrapper {
  static registerAsync(connectOptions: RabbitMQConnectAsyncOptions): DynamicModule {
    return {
      module: AmqplibWrapper,
      providers: [AmqplibService, ...this.createConnectProviders(connectOptions)],
      exports: [AmqplibService],
    };
  }

  private static createConnectProviders(options: RabbitMQConnectAsyncOptions): Provider[] {
    return [
      {
        provide: 'AMQPLIB_CONNECT_OPTIONS',
        useFactory: async (optionsFactory: RabbitMQOptionsFactory) => await optionsFactory.createRabbitMQConnectOptions(),
        inject: [options.useClass],
      },
      {
        provide: options.useClass,
        useClass: options.useClass,
      },
    ];
  }
}
