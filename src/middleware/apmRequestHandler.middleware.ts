import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { createCustomTransaction } from '@havenengineering/module-shared-apm';

@Injectable()
export class ApmRequestHandlerMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const transaction = createCustomTransaction(
      {
        trackerName: `${req.method} ${req.url}`,
        trackerType: 'request',
      },
      req
    );

    res.on('finish', () => {
      if (transaction) {
        transaction.end();
      }
    });
    next();
  }
}
