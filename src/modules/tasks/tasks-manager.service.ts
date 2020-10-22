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

  handlePyramidEACMessage = async (message: Record<string, any>) => {
    this.logger.debug(`get Pyramid EAC Message ${message}`);
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    return this.pyramidParser.parsePramidLine(line, data.metadata);
  };

  handlePyramidActualsMessage = async (message: Record<string, any>) => {
    this.logger.debug(`get Pyramid Actuals Message ${message}`);
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    return this.pyramidParser.parsePramidLine(line, data.metadata, true);
  };

  handleNosicaMessage = message => {
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    this.nosicaParser.parseNosicaLine(line, data.metadata);
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
          channel.assertQueue(this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.NAME).then(ok => {
            channel.prefetch(50).then(() => {
              channel.consume(this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.NAME, msg => {
                if (msg !== null) {
                  return this.handlePyramidEACMessage(msg).then(() => {
                    channel.ack(msg);
                  });
                }
              });
            });
          }),
          channel.assertQueue(this.constantService.GLOBAL_CONST.QUEUE.PYRAMIDACTUALS_QUEUE.NAME).then(ok => {
            channel.prefetch(50).then(() => {
              channel.consume(this.constantService.GLOBAL_CONST.QUEUE.PYRAMIDACTUALS_QUEUE.NAME, msg => {
                if (msg !== null) {
                  return this.handlePyramidActualsMessage(msg).then(() => {
                    channel.ack(msg);
                  });
                }
              });
            });
          }),
          channel.assertQueue(this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.NAME).then(ok =>
            channel.prefetch(50).then(() => {
              channel.consume(this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.NAME, msg => {
                if (msg !== null) {
                  this.handleNosicaMessage(msg);
                  channel.ack(msg);
                }
              });
            }),
          ),
        ]);
      })
      .catch(error => {
        this.logger.error(error);
      });
  }
}
