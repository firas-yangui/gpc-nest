import { Injectable } from '@nestjs/common';

@Injectable()
export class ConstantService {
  public GLOBAL_CONST = Object.freeze({
    AMOUNT_UNITS: Object.freeze({
      KLC: 'klocalcurrency',
      KEURO: 'keuros',
      KEURO_SALES: 'keurossales',
      MD: 'mandays',
    }),
    QUEUE: Object.freeze({
      PYRAMID_QUEUE: 'pyramid_queue',
      NOSICA_QUEUE: 'nosica_queue',
    }),
  });
}
