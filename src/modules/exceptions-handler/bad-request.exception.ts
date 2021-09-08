import { BusinessException } from './business.exception';
import { HttpStatus } from '@nestjs/common';

// BadRequestException extend BusinessException
export class CustomBadRequestException extends BusinessException {
  constructor(code, message: string, errors?) {
    /*eslint-disable*/
    super(HttpStatus.BAD_REQUEST, code, message, errors);
    /*eslint-disable*/

  }
}
