import { Injectable } from '@nestjs/common';

import { ConfigService } from '../services/config.service';
import { ApiKeyCheckMiddleware } from './apiKeyCheck.middleware';

@Injectable()
export class AdminApiKeyCheckMiddleware extends ApiKeyCheckMiddleware {
  constructor(private configService: ConfigService) {
    super();
    this.apiKey = this.configService.get<string>('admin-api-key');
  }
}
