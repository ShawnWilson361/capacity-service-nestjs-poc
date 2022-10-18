import { Logger } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { ApplicationErrorFilter } from '../../../src/filters/applicationError.filter';

export default async (moduleRef: TestingModule, logger?: Logger) => {
  const app = moduleRef.createNestApplication();
  app.useGlobalFilters(new ApplicationErrorFilter(logger || new Logger()));
  await app.init();

  return app;
};
