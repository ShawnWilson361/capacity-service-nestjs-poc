import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '../errors/ApplicationError.error';
import { DEFAULT_HEADER_PATH, apiKeyIsValid } from '../utils/apiKeyIsValid';

@Injectable()
export class ApiKeyCheckMiddleware implements NestMiddleware {
  apiKey: string;
  headerPath: string = DEFAULT_HEADER_PATH;

  use(req: Request, res: Response, next: NextFunction) {
    if (!this.apiKey) {
      return next(new ApplicationError('API key not found', 500, null));
    }

    if (!apiKeyIsValid(this.apiKey, req, this.headerPath)) {
      return next(new ApplicationError('Unauthorized', 401, 'Unauthorized'));
    }

    return next();
  }
}
