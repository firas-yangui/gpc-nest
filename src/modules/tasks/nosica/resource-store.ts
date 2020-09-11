import { Injectable } from '@nestjs/common';
import { includes } from 'lodash';

@Injectable()
export class ResourceManager {
  private resourceIds: Array<string>;

  constructor() {
    this.resourceIds = [];
  }

  add = (resourceId: string) => {
    return this.resourceIds.push(resourceId);
  };

  exists = (resourceId: string) => {
    return includes(this.resourceIds, resourceId);
  };

  reset = () => {
    this.resourceIds = [];
  };
}
