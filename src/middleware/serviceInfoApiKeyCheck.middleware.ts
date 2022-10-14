import { Injectable, NestMiddleware } from '@nestjs/common';

import { ConfigService } from '../services/config.service';
import { ApiKeyCheckMiddleware } from './apiKeyCheck.middleware';

@Injectable()
export class ServiceInfoApiKeyCheckMiddleware extends ApiKeyCheckMiddleware {
  constructor(private configService: ConfigService) {
    super();
    this.apiKey = this.configService.get<string>('service-info-api-key');
  }
}
