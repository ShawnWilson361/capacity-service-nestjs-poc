import { Injectable, NestMiddleware } from '@nestjs/common';
import * as config from 'config';
import { NextFunction, Request, Response } from 'express';
import { v4 as uuid } from 'uuid';

import { als } from '@havenengineering/module-haven-logging';

@Injectable()
export class CorrelateRequestMiddleware implements NestMiddleware {
  private traceHeaderLabel: string;

  constructor() {
    this.traceHeaderLabel = config.get('trace-header');
  }

  use(req: Request, res: Response, next: NextFunction) {
    const store = new Map();

    const traceId = this.getTraceId(req);
    const correlationId = traceId || uuid();

    if (!traceId) {
      this.setTraceIdHeader(req, correlationId);
    }

    this.setResponseTraceHeader(res, correlationId);

    store.set('correlationId', correlationId);

    als.run(store, () => next());
  }

  getTraceId = (req: Request): string =>
    req.headers[this.traceHeaderLabel] as string;

  setTraceIdHeader = (req: Request, traceId: string): string =>
    (req.headers[this.traceHeaderLabel] = traceId);

  setResponseTraceHeader = (res: Response, traceId: string): void => {
    res.set(this.traceHeaderLabel, traceId);
  };
}
