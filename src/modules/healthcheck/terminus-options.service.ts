import { TerminusEndpoint, TerminusOptionsFactory, TerminusModuleOptions } from '@nestjs/terminus';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TerminusOptionsService implements TerminusOptionsFactory {
  public readonly healthEndpointUrl: string;

  constructor() {
    this.healthEndpointUrl = '/api/health';
  }
  createTerminusOptions(): TerminusModuleOptions {
    const healthEndpoint: TerminusEndpoint = {
      url: `${this.healthEndpointUrl}`,
      healthIndicators: [],
    };
    return {
      endpoints: [healthEndpoint],
    };
  }
}
