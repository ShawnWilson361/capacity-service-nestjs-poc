import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { captureError } from '@havenengineering/module-shared-apm';

import { ErrorWithLabels } from '../errors/ErrorWithLabels.error';
import { isErrorWithLabels } from '../utils/isErrorWithLabels';

@Injectable()
export class ApmCaptureErrorHandlerMiddleware implements NestMiddleware {
  // use(e: ErrorWithLabels, req: Request, res: Response, next: NextFunction) {
  //   if (isErrorWithLabels(e)) {
  //     captureError(e, e.metadata.labels);
  //   } else {
  //     captureError(e, { labels: { action: 'unknown' } });
  //   }
  //   next(e);
  // }

  use(req: Request, res: Response, next: NextFunction) {
    next();
  }
}
