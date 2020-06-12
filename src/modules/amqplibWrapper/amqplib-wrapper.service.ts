import { Injectable, Inject } from '@nestjs/common';
import { Connection, connect } from 'amqplib';

@Injectable()
export class AmqplibService {
  private _amqplibClient;

  constructor(@Inject('AMQPLIB_CONNECT_OPTIONS') private _amqplibConnectOptions) {}

  async connect(): Promise<Connection> {
    return this._amqplibClient ? this._amqplibClient : (this._amqplibClient = await connect(this._amqplibConnectOptions));
  }
}
