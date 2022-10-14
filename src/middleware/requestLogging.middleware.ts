import { Injectable, Logger, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ILogConfiguration } from './types/ILogConfiguration';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private HOLDER_PROPERTY = '_requestLogConfiguration';

  constructor(private logger: Logger) {}

  use(req: Request, res: Response, next: NextFunction) {
    if (req.baseUrl.includes('health') || req.path.includes('health')) {
      return next();
    }

    const getRequestLoggerConfiguration = (req: Request): ILogConfiguration =>
      // eslint-disable-next-line @typescript-eslint/no-unsafe-return
      req[this.HOLDER_PROPERTY] || ({} as ILogConfiguration);

    const startHrTime = process.hrtime();
    let body: string = undefined;

    /* eslint-disable @typescript-eslint/unbound-method */
    const oldWrite = res.write;
    /* eslint-disable @typescript-eslint/unbound-method */
    const oldEnd = res.end;

    const chunks: Buffer[] = [];
    const _res: Response = res;
    _res.write = function (chunk: string) {
      const reqLogConfig = getRequestLoggerConfiguration(req);
      if (reqLogConfig.resBody) {
        chunks.push(Buffer.from(chunk));
      }

      /* eslint-disable prefer-rest-params */
      return oldWrite.apply(res, arguments) as boolean;
    };

    _res.end = function (chunk?: string | (() => void)) {
      const reqLogConfig = getRequestLoggerConfiguration(req);
      if (reqLogConfig.resBody && typeof chunk === 'string') {
        chunks.push(Buffer.from(chunk));

        body = Buffer.concat(chunks).toString('utf8');
      }

      /* eslint-disable prefer-rest-params */
      oldEnd.apply(res, arguments);
      return res;
    };

    res.on('finish', (): void => {
      const elapsedHrTime = process.hrtime(startHrTime);
      const elapsedTimeInMs = elapsedHrTime[0] * 1000 + elapsedHrTime[1] / 1e6;

      const reqLogConfig = getRequestLoggerConfiguration(req);

      this.logger.log('finished', {
        responseTime: elapsedTimeInMs,
        meta: {
          req: {
            url: req.originalUrl,
            method: req.method,
            headers: req.headers,
            query: req.query,
            body: (reqLogConfig.reqBody ? req.body : undefined) as unknown,
          },
          res: {
            body: reqLogConfig.resBody ? body : undefined,
            statusCode: res.statusCode,
          },
        },
      });
    });

    return next();
  }
}
