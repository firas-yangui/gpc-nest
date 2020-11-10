import { Injectable } from '@nestjs/common';

@Injectable()
export class Helpers {
  isHeader = (object: Record<string, any>): boolean => {
    for (const key in object) {
      const value = object[key];
      if (value === key) return true;
    }
    return false;
  };
}
