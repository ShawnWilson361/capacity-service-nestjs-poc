import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService as NestJsConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import config from '../../../src/config';
import { EntitySource } from '../../../src/entities';
import { EntitySourceRepository } from '../../../src/repositories';
import { integrationSeed } from '../../../src/seeds/integrationSeed';
import { ManagementEntitySourceItem } from '../../../src/types/shared';
import createNestAppHelper from '../helpers/createNestApp.helper';
import { createEntitySource } from '../helpers/entitySource.helper';
import setupTestingModuleHelper from '../helpers/setupTestingModule.helper';

/**
 * @group integration
 */
describe('integration - management - entity source - v1', () => {
  let app: INestApplication;
  let server: any;
  let dataSource: DataSource;
  let entitySourceRepository: EntitySourceRepository;

  let authHeaders: {
    'x-api-key': string;
  };

  let activitiesApiKey: string;

  beforeEach(async () => {
    jest.resetModules();
    activitiesApiKey = uuid();
    authHeaders = {
      'x-api-key': 'test',
    };

    const getConfigService = jest.fn((key: string) => {
      if (key === 'ACTIVITIES_INTERNAL_API_KEY') {
        return activitiesApiKey;
      }
      if (key === 'database_connection') {
        return config().database_connection;
      }
      return null;
    });

    const testingModule = setupTestingModuleHelper({});

    const moduleRef = await testingModule
      .overrideProvider(NestJsConfigService)
      .useValue({ get: getConfigService })
      .compile();

    entitySourceRepository = await moduleRef.resolve<EntitySourceRepository>(
      EntitySourceRepository
    );

    dataSource = await moduleRef.resolve<DataSource>(DataSource);

    await integrationSeed(dataSource);

    const logger = await moduleRef.resolve<Logger>(Logger);

    app = await createNestAppHelper(moduleRef, logger);
    server = app.getHttpServer();
  });

  afterEach(async () => {
    await entitySourceRepository.delete({});
    jest.resetAllMocks();
    await app?.close();
    server.close();
  });

  describe('[GET] /management/v1/entitySource', () => {
    let entitySource: EntitySource;
    let entitySource2: EntitySource;

    beforeEach(async () => {
      entitySource = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '537573c0-6755-460a-b55d-26c6a8412d65',
          name: 'activities',
          description: 'Haven Experience Activity',
          keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
        })
      );
      entitySource2 = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '467af65d-3bb3-4192-9ba7-40460ae28f3a',
          name: 'swimming',
          description: 'Haven Experience Swimming',
          keyReference: 'SWIMMING_INTERNAL_API_KEY',
        })
      );
    });

    it('returns a list of entity sources', async () => {
      const response = await request(server)
        .get(`/management/v1/entitySource`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        count: 2,
        items: [
          expect.objectContaining({
            id: '467af65d-3bb3-4192-9ba7-40460ae28f3a',
            isLive: true,
            name: 'swimming',
            keyReference: 'SWIMMING_INTERNAL_API_KEY',
          }),
          expect.objectContaining({
            id: '537573c0-6755-460a-b55d-26c6a8412d65',
            isLive: true,
            keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
            name: 'activities',
          }),
        ],
        query: {
          filters: {},
          limit: 50,
          orderBy: 'id',
          orderDirection: 'ASC',
          page: 0,
        },
        success: true,
      });
    });

    it('returns a list of entity sources filtered by query params', async () => {
      const response = await request(server)
        .get(`/management/v1/entitySource`)
        .query({
          orderBy: 'name',
          orderDirection: 'DESC',
          page: 0,
          limit: 10,
          filters: {
            id: entitySource.id,
            name: 'act',
          },
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        count: 1,
        items: [
          expect.objectContaining({
            id: '537573c0-6755-460a-b55d-26c6a8412d65',
            name: 'activities',
            isLive: true,
            keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
          }),
        ],
        query: {
          orderBy: 'name',
          orderDirection: 'DESC',
          page: '0',
          limit: '10',
          filters: {
            id: entitySource.id,
            name: 'act',
          },
        },
        success: true,
      });
    });

    it('returns 401 if x-api-key is missing', async () => {
      const response = await request(server).get(`/management/v1/entitySource`);

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    });
  });

  describe('[GET] /management/v1/entitySource/:id', () => {
    it('returns an entity source associated with the provided id', async () => {
      const entitySource = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '537573c0-6755-460a-b55d-26c6a8412d65',
          name: 'activities',
          description: 'Haven Experience Activity',
          keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
        })
      );

      const response = await request(server)
        .get(`/management/v1/entitySource/${entitySource.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        entitySource: expect.objectContaining({
          id: '537573c0-6755-460a-b55d-26c6a8412d65',
          isLive: true,
          keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
          name: 'activities',
        }),
        success: true,
      });
    });

    it('returns 404 if entity source not found', async () => {
      const response = await request(server)
        .get(`/management/v1/entitySource/${uuid()}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(404);
      expect(response.body).toStrictEqual({
        code: 'NOT FOUND',
        message: 'Not found!',
        status: 404,
        success: false,
      });
    });

    it('returns 401 if x-api-key is missing', async () => {
      const response = await request(server).get(
        `/management/v1/entitySource/${uuid()}`
      );

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    });
  });

  describe('[POST] /management/v1/entitySource', () => {
    it('creates, saves and returns a new entity source', async () => {
      const response = await request(server)
        .post('/management/v1/entitySource')
        .send({
          entitySource: {
            name: 'test',
            keyReference: 'test',
          },
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        success: true,
        entitySource: expect.objectContaining({ name: 'test' }),
      });
    });

    it('returns 401 if x-api-key is missing', async () => {
      const response = await request(server)
        .post('/management/v1/entitySource')
        .send({
          entitySource: {
            name: 'test',
            keyReference: 'test',
          },
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    });
  });

  describe('[PUT] /management/v1/entitySource/:id', () => {
    it('updates, saves and returns an entity source', async () => {
      const entitySource = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '537573c0-6755-460a-b55d-26c6a8412d65',
          name: 'activities',
          description: 'Haven Experience Activity',
          keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
        })
      );

      const response = await request(server)
        .put(`/management/v1/entitySource/${entitySource.id}`)
        .send({
          entitySource: {
            name: 'test',
            keyReference: 'ABC123',
          } as ManagementEntitySourceItem,
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        entitySource: expect.objectContaining({ name: 'test' }),
      });
    });

    it('returns 401 if x-api-key is missing', async () => {
      const entitySource = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '537573c0-6755-460a-b55d-26c6a8412d65',
          name: 'activities',
          description: 'Haven Experience Activity',
          keyReference: 'ACTIVITIES_INTERNAL_API_KEY',
        })
      );

      const response = await request(server)
        .put(`/management/v1/entitySource/${entitySource.id}`)
        .send({
          entitySource: {
            name: 'test',
          },
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    });
  });

  describe('[DELETE] /management/v1/entitySource/:id', () => {
    it('delete an entity source', async () => {
      const entitySource = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '467af65d-3bb3-4192-9ba7-40460ae28f3a',
          name: 'swimming',
          description: 'Haven Experience Swimming',
          keyReference: 'SWIMMING_INTERNAL_API_KEY',
        })
      );

      const response = await request(server)
        .delete(`/management/v1/entitySource/${entitySource.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        id: entitySource.id,
      });
    });

    it('returns 401 if x-api-key is missing', async () => {
      const entitySource = await entitySourceRepository.upsertEntitySource(
        createEntitySource({
          id: '467af65d-3bb3-4192-9ba7-40460ae28f3a',
          name: 'swimming',
          description: 'Haven Experience Swimming',
          keyReference: 'SWIMMING_INTERNAL_API_KEY',
        })
      );

      const response = await request(server).delete(
        `/management/v1/entitySource/${entitySource.id}`
      );

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        message: 'Unauthorized',
        status: 401,
        success: false,
      });
    });
  });
});
