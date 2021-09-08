import { BusinessException } from './business.exception';
import { HttpStatus } from '@nestjs/common';

// NoContent extend BusinessException
export class NoContent extends BusinessException {
  constructor(code, message: string, errors?) {
    /*eslint-disable*/
    super(HttpStatus.NO_CONTENT, code, message, errors);
    /*eslint-disable*/

  }
}
