import { Injectable, Inject } from '@nestjs/common';
import { Connection, connect } from 'amqplib';
import { readFileSync } from 'fs';

@Injectable()
export class AmqplibService {
  private _amqplibClient;

  constructor(@Inject('AMQPLIB_CONNECT_OPTIONS') private _amqplibConnectOptions) {}

  async connect(): Promise<Connection> {
    return this._amqplibClient
      ? this._amqplibClient
      : (this._amqplibClient = await connect(this._amqplibConnectOptions, {
          ca: readFileSync('/data/ca-certificate'),
        }));
  }
}
