import { Injectable, Inject } from '@nestjs/common';
import { connect } from 'amqplib';
import { RabbitMQOptionsFactory, RabbitMQConnectOptions } from 'src/modules/interfaces/common-interfaces';

@Injectable()
export class ConfigService implements RabbitMQOptionsFactory {
  host = 'rabbitmq-server';
  port = 5672;
  user = 'guest';
  password = 'guest';
  vhost = '/';

  createRabbitMQConnectOptions(): RabbitMQConnectOptions | string {
    // return 'amqp://rabbitmq-server';
    return `amqp://${this.user}:${this.password}@${this.host}:${this.port}/${this.vhost}`;
  }
}
