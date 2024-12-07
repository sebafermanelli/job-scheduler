import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

export class CorsConfig {
  constructor() {}

  getCorsOptions(): CorsOptions {
    return {
      origin: true,
      methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
      credentials: true,
    };
  }
}
