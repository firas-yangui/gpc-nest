import { BusinessException } from './business.exception';
// EntityNotFoundException extend BusinessException
export class EntityNotFoundException extends BusinessException {
  constructor(code: string, message: string, errors?) {
    super(404, code, message, errors);
  }
}
