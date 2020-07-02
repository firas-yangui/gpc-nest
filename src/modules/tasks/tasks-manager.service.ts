import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NosicaParser } from './nosica/nosica.parser';
import { PyramidParser } from './pyramid/pyramid.parser';
import { Connection, Channel } from 'amqplib';
import { ConstantService } from '../constants/constants';
import { AmqplibService } from './../amqplibWrapper/amqplib-wrapper.service';

@Injectable()
export class TasksService implements OnModuleInit {
  private readonly logger = new Logger(TasksService.name);
  constructor(
    private readonly amqplibService: AmqplibService,
    private nosicaParser: NosicaParser,
    private pyramidParser: PyramidParser,
    private constantService: ConstantService,
  ) {}

  handlePyramidMessage = message => {
    this.logger.debug(`get PyramidMessage ${message}`);
    this.pyramidParser.pyramidCallback(message);
  };

  handleNosicaMessage = message => {
    this.logger.debug('get NosicaMessage', message);
    this.nosicaParser.nosicaCallback(message);
  };

  public onModuleInit() {
    this.amqplibService
      .connect()
      .then((connection: Connection) => {
        this.logger.debug('rabbitmq-server connected');
        return connection.createChannel();
      })
      .then((channel: Channel) => {
        Promise.all([
          channel.assertQueue(this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE).then(ok =>
            channel.consume(this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE, msg => {
              if (msg !== null) {
                this.handlePyramidMessage(msg);
                channel.ack(msg);
              }
            }),
          ),
          channel.assertQueue(this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE).then(ok =>
            channel.consume(this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE, msg => {
              if (msg !== null) {
                this.handleNosicaMessage(msg);
                channel.ack(msg);
              }
            }),
          ),
        ]);
      })
      .catch(error => {
        this.logger.error(error);
      });
  }
}
