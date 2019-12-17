import { BusinessException } from './business.exception';
// BadRequestException extend BusinessException
export class CustomBadRequestException extends BusinessException {
  constructor(code, message: string, errors?) {
    super(400, code, message, errors);
  }
}
