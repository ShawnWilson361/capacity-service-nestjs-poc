import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { CacheOptions } from './types/CacheOptions';
import { GeneralOptions } from './types/GeneralOptions';

@Injectable()
export class SetCacheHeaderMiddleware implements NestMiddleware {
  private cacheSMaxAge: number;
  private cacheMaxAge: number;
  private isImmutable: boolean;

  constructor(
    { cacheSMaxAge = 0, cacheMaxAge = 0 }: CacheOptions,
    { isImmutable = false }: GeneralOptions
  ) {
    this.cacheSMaxAge = cacheSMaxAge;
    this.cacheMaxAge = cacheMaxAge;
    this.isImmutable = isImmutable;
  }

  use(req: Request, res: Response, next: NextFunction) {
    res.setHeader(
      'Cache-Control',
      `public,s-maxage=${this.cacheSMaxAge},max-age=${this.cacheMaxAge}${
        this.isImmutable ? ',immutable' : ''
      }`
    );
    next();
  }
}
