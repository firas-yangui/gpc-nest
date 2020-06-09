import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NosicaParser } from './nosica/nosica.parser';
import { Connection, connect, Channel } from 'amqplib';
import { GLOBAL_CONST } from './../../../src/constants';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);

  handlePyramidMessage = message => {
    this.logger.debug('get message');
  };

  public onModuleInit() {
    connect(`amqp://rabbitmq-server`)
      .then((connection: Connection) => {
        this.logger.debug('rabbitmq-server connected');
        return connection.createChannel();
      })
      .then((channel: Channel) =>
        channel.assertQueue(GLOBAL_CONST.QUEUE.PYRAMID_QUEUE).then(ok =>
          channel.consume(GLOBAL_CONST.QUEUE.PYRAMID_QUEUE, msg => {
            if (msg !== null) {
              this.handlePyramidMessage(msg);
              channel.ack(msg);
            }
          }),
        ),
      )
      .catch(error => {
        this.logger.error('Error: ', error);
      });
  }
}
