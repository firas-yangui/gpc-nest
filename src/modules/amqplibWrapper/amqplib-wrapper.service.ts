import { Injectable, Inject } from '@nestjs/common';
import { Connection, connect } from 'amqplib';
import { readFileSync } from 'fs';
import { Logger } from '@nestjs/common';

@Injectable()
export class AmqplibService {
  private readonly logger = new Logger(AmqplibService.name);
  private _amqplibClient;

  constructor(@Inject('AMQPLIB_CONNECT_OPTIONS') private _amqplibConnectOptions) {}

  async connect(): Promise<Connection> {
    let options = {};
    process.env.NODE_ENV == 'development'
      ? (options = {})
      : (options = {
          ca: readFileSync('/config/ca-certificate'),
        });

    return this._amqplibClient ? this._amqplibClient : (this._amqplibClient = await connect(this._amqplibConnectOptions, options));
  }
}
