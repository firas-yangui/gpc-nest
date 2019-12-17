import { PipeTransform, Injectable, ArgumentMetadata } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { CustomBadRequestException } from './bad-request.exception';

@Injectable()
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class BusinessValidationPipe implements PipeTransform<any> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async transform(value: any, metadata: ArgumentMetadata) {
    if (value instanceof Object && this.isEmpty(value)) {
      throw new CustomBadRequestException('BAD_REQUEST', 'Validation Failed: No body submitted');
    }
    const { metatype } = metadata;
    if (!metatype || !this.toValidate(metatype)) {
      return value;
    }
    const object = plainToClass(metatype, value);
    const errors = await validate(object);
    if (errors.length > 0) {
      throw new CustomBadRequestException('BAD_REQUEST', 'Bad request', this.formatErrors(errors));
    }
    return value;
  }

  private toValidate(metatype: Function): boolean {
    const types: Function[] = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private formatErrors(errors: any) {
    return errors.map(err => {
      for (const property in err.constraints) {
        return err.constraints[property];
      }
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private isEmpty(value: any) {
    if (Object.keys(value).length > 0) {
      return false;
    }
    return true;
  }
}
