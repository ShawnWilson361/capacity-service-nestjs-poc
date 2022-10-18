import { INestApplication, Logger } from '@nestjs/common';
import * as request from 'supertest';
import { DataSource } from 'typeorm';

import { integrationSeed } from '../../src/seeds/integrationSeed';
import createNestAppHelper from './helpers/createNestApp.helper';
import setupTestingModuleHelper from './helpers/setupTestingModule.helper';

describe('integration - health', () => {
  let app: INestApplication;
  let server: any;

  let authHeaders: {
    'x-api-key': string;
  };

  beforeEach(async () => {
    authHeaders = {
      'x-api-key': 'test',
    };

    const testingModule = setupTestingModuleHelper({});

    const moduleRef = await testingModule.compile();

    const dataSource = await moduleRef.resolve<DataSource>(DataSource);

    await integrationSeed(dataSource);

    const logger = await moduleRef.resolve<Logger>(Logger);

    app = await createNestAppHelper(moduleRef, logger);
    server = app.getHttpServer();
  });

  afterEach(async () => {
    jest.resetAllMocks();
    await app?.close();
    server?.close();
  });

  describe('[GET] /_health', () => {
    it('should return success', async () => {
      const response = await request(server).get(`/_health`).set(authHeaders);

      expect(response.statusCode).toStrictEqual(200);
      expect(response.body).toStrictEqual({ success: true });
    });

    it('returns 401 if x-api-key is not provided', async () => {
      const response = await request(server).get(`/_health`);

      expect(response.statusCode).toStrictEqual(401);
      expect(response.body).toStrictEqual({
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    });
  });
});
