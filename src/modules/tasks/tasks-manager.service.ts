import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { NosicaParser } from './nosica/nosica.parser';
import { PyramidParser } from './pyramid/pyramid.parser';
import { MyGTSParser } from './myGTS/myGTS.parser';
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
    private myGTSParser: MyGTSParser,
  ) {}

  handlePyramidEACMessage = async (message: Record<string, any>) => {
    if (!message || !message.content) return;
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    try {
      const parsedData = await this.pyramidParser.parsePramidLine(line, data.metadata);
      return await this.pyramidParser.pyramidCallback(parsedData, data.metadata, false);
    } catch (error) {
      this.logger.error(`Pyramid EAC error occurred: ${error}`);
      return;
    }
  };

  handlePyramidActualsMessage = async (message: Record<string, any>) => {
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    try {
      const parsedData = await this.pyramidParser.parsePramidLine(line, data.metadata, true);
      const insertedData = await this.pyramidParser.pyramidCallback(parsedData, data.metadata, true);
      return insertedData;
    } catch (error) {
      this.logger.error(`Pyramid Actual error occurred: ${error}`);
      return;
    }
  };

  handleMyGTSMessage = async (message: Record<string, any>) => {
    //{"line":"RESG/BSC/DIR|@|40|@|NRG0016|@|COLLABORATIVE SERVICES|@|COLLABORATIVE SERVICES|@|04/01/2020","metadata":{"filename":"turluttuu"}}
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.MYGTS_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    try {
      const parsedData = await this.myGTSParser.parseMyGTSLine(line, data.metadata);
      const insertedData = await this.myGTSParser.myGTSCallback(parsedData, data.metadata);
      return insertedData;
    } catch (error) {
      this.logger.error(`myGTS error occurred: ${error}`);
      return;
    }
  };

  handleNosicaMessage = async (message): Promise<any> => {
    const data = JSON.parse(message.content.toString('utf8'));
    const separator = this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.ORIGIN_SEPARATOR;
    const regex = new RegExp(separator, 'g');
    const line = data.line.replace(regex, ';');
    const parsed = await this.nosicaParser.parseNosicaLine(line, data.metadata);
    return this.nosicaParser.nosicaCallback(parsed, separator, data.metadata);
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
          channel
            .assertQueue(this.constantService.GLOBAL_CONST.QUEUE.MYGTS_QUEUE.NAME)
            .then(ok => channel.prefetch(10))
            .then(() =>
              channel.consume(this.constantService.GLOBAL_CONST.QUEUE.MYGTS_QUEUE.NAME, async msg =>
                this.handleMyGTSMessage(msg).then(() => {
                  return channel.ack(msg);
                }),
              ),
            ),
          channel
            .assertQueue(this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.NAME)
            .then(ok => channel.prefetch(10))
            .then(() =>
              channel.consume(this.constantService.GLOBAL_CONST.QUEUE.PYRAMID_QUEUE.NAME, async msg =>
                this.handlePyramidEACMessage(msg).then(() => {
                  return channel.ack(msg);
                }),
              ),
            ),
          channel.assertQueue(this.constantService.GLOBAL_CONST.QUEUE.PYRAMIDACTUALS_QUEUE.NAME).then(ok => {
            channel.prefetch(1).then(() => {
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
            channel.prefetch(10).then(() => {
              channel.consume(this.constantService.GLOBAL_CONST.QUEUE.NOSICA_QUEUE.NAME, msg => {
                if (msg !== null) {
                  this.handleNosicaMessage(msg).then(() => channel.ack(msg));
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
