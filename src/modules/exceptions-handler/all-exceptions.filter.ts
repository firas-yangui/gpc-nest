import { Catch, ExceptionFilter, HttpException, ArgumentsHost, Logger } from '@nestjs/common';
import { BusinessException } from './business.exception';
import { CustomBadRequestException } from './bad-request.exception';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    const status = exception.getStatus();

    let errorResponse = {
      code: status,
      message: exception.message,
      errors: [] || undefined,
    };

    if (exception instanceof BusinessException) {
      Logger.error('exception', JSON.stringify(exception));
      const e: BusinessException = exception;
      const statusMsg = e.getStatus();
      const msg = e.getMessage();
      errorResponse = {
        code: statusMsg,
        message: msg,
        errors: [] || undefined,
      };
    }
    if (exception instanceof CustomBadRequestException) {
      Logger.error('exception', JSON.stringify(exception));
      const e: CustomBadRequestException = exception;
      const statusMsg = e.getStatus();
      const msg = e.getMessage();
      errorResponse = {
        code: statusMsg,
        message: msg,
        errors: e.getErrors() || [] || undefined,
      };
    }
    Logger.error(`${request.method} ${request.url}`, JSON.stringify(errorResponse), 'ExceptionFilter');
    response.status(status).json(errorResponse);
  }
}
