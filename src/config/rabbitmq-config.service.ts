import { Injectable } from '@nestjs/common';
import { RabbitMQOptionsFactory, RabbitMQConnectOptions } from 'src/modules/interfaces/common-interfaces';

@Injectable()
export class ConfigService implements RabbitMQOptionsFactory {
  protocol = process.env.RMQ_PROTOCOL || 'amqp';
  host = process.env.RMQ_HOST || 'rabbitmq-server';
  port = process.env.RMQ_PORT || 5672;
  user = process.env.RMQ_USER || 'guest';
  password = process.env.RMQ_PASSWORD || 'guest';
  vhost = process.env.RMQ_VHOST || '/';

  createRabbitMQConnectOptions(): RabbitMQConnectOptions | string {
    return `${this.protocol}://${this.user}:${this.password}@${this.host}:${this.port}/${this.vhost}`;
  }
}
