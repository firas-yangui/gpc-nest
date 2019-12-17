import { SwaggerSchemes } from './configuration.interfaces';

export function toSchemes(value: string): SwaggerSchemes {
  return value
    ? value.split(',').map(scheme => {
        switch (scheme.trim().toLowerCase()) {
          case 'http':
            return 'http';
          case 'https':
            return 'https';
          default:
            throw new Error(`Bad value for scheme ${scheme}`);
        }
      })
    : [];
}
