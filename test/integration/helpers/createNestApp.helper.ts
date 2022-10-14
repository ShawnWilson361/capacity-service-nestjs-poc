import { Logger } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';

import { ApplicationErrorFilter } from '../../../src/filters/applicationError.filter';

export default async (moduleRef: TestingModule) => {
  const app = moduleRef.createNestApplication();
  app.useGlobalFilters(new ApplicationErrorFilter(new Logger()));
  await app.init();

  return app;
};
