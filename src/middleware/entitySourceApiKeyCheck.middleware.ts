import { AsyncContext } from '@nestjs-steroids/async-context';
import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

import { ApplicationError } from '../errors/ApplicationError.error';
import { EntitySourceService } from '../services/entitySource.service';

@Injectable()
export class EntitySourceApiKeyCheckMiddleware implements NestMiddleware {
  constructor(
    @Inject(EntitySourceService)
    private readonly entitySourceService: EntitySourceService,
    private readonly asyncContext: AsyncContext<string, string>
  ) {}

  private entitySourceApiKeyCheck() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const entityStoreId =
        await this.entitySourceService.getEntitySourceIdFromRequest(req);

      if (!entityStoreId) {
        throw new ApplicationError('Unauthorized', 401, 'unauthorized');
      }

      this.asyncContext.set('entitySourceId', entityStoreId);

      next();
    };
  }

  use(req: Request, res: Response, next: NextFunction) {
    const mware = this.entitySourceApiKeyCheck();

    return mware(req, res, next);
  }
}
