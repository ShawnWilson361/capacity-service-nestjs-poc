import { INestApplication, Logger } from '@nestjs/common';
import { ConfigService as NestJsConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import config from '../../../src/config';
import { Capacity } from '../../../src/entities';
import {
  CapacityChangeRepository,
  CapacityRepository,
} from '../../../src/repositories';
import { integrationSeed } from '../../../src/seeds/integrationSeed';
import {
  createCapacity,
  createEntityResponse,
} from '../helpers/capacity.helper';
import { createCapacityChange } from '../helpers/capacityChange.helper';
import createNestAppHelper from '../helpers/createNestApp.helper';
import setupTestingModuleHelper from '../helpers/setupTestingModule.helper';

/**
 * @group integration
 */
describe('integration - management - capacity - v1', () => {
  let app: INestApplication;
  let server: any;
  let dataSource: DataSource;
  let capacityRepository: CapacityRepository;
  let capacityChangeRepository: CapacityChangeRepository;
  let nestJsConfigService: NestJsConfigService;

  const entitySourceId = '537573c0-6755-460a-b55d-26c6a8412d65';

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

    capacityRepository = await moduleRef.resolve<CapacityRepository>(
      CapacityRepository
    );

    capacityChangeRepository =
      await moduleRef.resolve<CapacityChangeRepository>(
        CapacityChangeRepository
      );

    dataSource = await moduleRef.resolve<DataSource>(DataSource);

    nestJsConfigService =
      moduleRef.get<NestJsConfigService>(NestJsConfigService);

    await integrationSeed(dataSource);

    const logger = await moduleRef.resolve<Logger>(Logger);

    app = await createNestAppHelper(moduleRef, logger);
    server = app.getHttpServer();
  });

  afterEach(async () => {
    await capacityChangeRepository.delete({});
    await capacityRepository.delete({});
    jest.resetAllMocks();
    await app?.close();
    server.close();
  });

  describe('[GET] /management/v1/capacity', () => {
    let capacity: Capacity;
    let capacity2: Capacity;

    beforeEach(async () => {
      capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      capacity2 = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );
    });

    it('returns a list of capacities', async () => {
      const response = await request(server)
        .get(`/management/v1/capacity`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        count: 2,
        items: expect.arrayContaining([
          expect.objectContaining({
            entityId: capacity2.entityId,
            entityType: capacity2.entityType,
            id: capacity2.id,
            maxCapacity: capacity2.maxCapacity,
            heldCapacity: capacity2.heldCapacity,
            usedCapacity: capacity2.usedCapacity,
          }),
          expect.objectContaining({
            entityId: capacity.entityId,
            entityType: capacity.entityType,
            id: capacity.id,
            maxCapacity: capacity.maxCapacity,
            heldCapacity: capacity.heldCapacity,
            usedCapacity: capacity.usedCapacity,
          }),
        ]),
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

    it('returns a list of capacities with query params', async () => {
      const response = await request(server)
        .get(`/management/v1/capacity`)
        .query({
          page: 0,
          limit: 10,
          orderBy: 'maxCapacity',
          orderDirection: 'DESC',
          filters: {
            entityId: capacity.entityId,
          },
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        count: 1,
        items: [
          expect.objectContaining({
            entityId: capacity.entityId,
            entityType: capacity.entityType,
            id: capacity.id,
            maxCapacity: capacity.maxCapacity,
            heldCapacity: capacity.heldCapacity,
            usedCapacity: capacity.usedCapacity,
          }),
        ],
        query: {
          page: '0',
          limit: '10',
          orderBy: 'maxCapacity',
          orderDirection: 'DESC',
          filters: {
            entityId: capacity.entityId,
          },
        },
        success: true,
      });
    });

    it('returns 401 if x-api-key is missing', async () => {
      const response = await request(server)
        .get(`/management/v1/capacity`)
        .query({
          page: 0,
          limit: 10,
          orderBy: 'maxCapacity',
          orderDirection: 'DESC',
          filters: {
            entityId: capacity.entityId,
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

  describe('[GET] /management/v1/capacity/:id', () => {
    it('returns a capacity object', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      await capacityChangeRepository.createCapacityChange(
        createCapacityChange({
          amount: 1,
          guestReferenceId: 'guest1',
          capacityId: capacity.id,
          capacity,
        })
      );

      const response = await request(server)
        .get(`/management/v1/capacity/${capacity.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);

      expect(response.body).toEqual({
        success: true,
        capacity: expect.objectContaining({
          ...createEntityResponse({
            ...capacity,
            deletedAt: undefined,
            entitySourceId: undefined,
          }),
          changes: expect.arrayContaining([
            expect.objectContaining({
              amount: 1,
              guestReferenceId: 'guest1',
            }),
          ]),
        }),
      });
    });

    it('returns 404 if capacity with id does not exist', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const response = await request(server)
        .get(`/management/v1/capacity/${uuid()}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(404);
    });

    it('returns 401 no x-api-key header provided', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server).get(
        `/management/v1/capacity/${capacity.id}`
      );

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('[POST] /management/v1/capacity', () => {
    it('creates, saves and returns a capacity object', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const response = await request(server)
        .post('/management/v1/capacity')
        .send({
          capacity: {
            entityId: capacity.entityId,
            entityType: capacity.entityType,
            maxCapacity: capacity.maxCapacity,
            usedCapacity: capacity.usedCapacity,
            heldCapacity: capacity.heldCapacity,
            isLive: capacity.isLive,
            entitySourceId,
          } as Partial<Capacity>,
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        success: true,
        capacity: expect.objectContaining({ entityId: 'test' }),
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const response = await request(server)
        .post('/management/v1/capacity')
        .send({
          capacity: {
            entityId: capacity.entityId,
            entityType: capacity.entityType,
            maxCapacity: capacity.maxCapacity,
            usedCapacity: capacity.usedCapacity,
            heldCapacity: capacity.heldCapacity,
            isLive: capacity.isLive,
            entitySourceId,
          } as Partial<Capacity>,
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'Unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('[PUT] /management/v1/capacity/:id', () => {
    it('updates, saves and returns success', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entityType: 'test',
          entitySourceId,
        })
      );

      const response = await request(server)
        .put(`/management/v1/capacity/${capacity.id}`)
        .send({
          capacity: {
            id: capacity.id,
            entityId: 'test',
            entityType: 'test2',
          },
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        capacity: expect.objectContaining({
          id: capacity.id,
          entityId: 'test',
          entityType: 'test2',
        }),
      });
    });

    it('returns 400 if no change', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entityType: 'test',
          entitySourceId,
        })
      );

      const response = await request(server)
        .put(`/management/v1/capacity/${capacity.id}`)
        .send({
          capacity: {
            id: capacity.id,
            entityId: 'test2',
            entityType: 'test',
          },
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        code: null,
        message: 'No update',
        status: 400,
        success: false,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entityType: 'test',
          entitySourceId,
        })
      );

      const response = await request(server)
        .put(`/management/v1/capacity/${capacity.id}`)
        .send({
          capacity: {
            id: capacity.id,
            entityId: 'test',
            entityType: 'test2',
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

  describe('[DELETE] /management/v1/capacity/:id', () => {
    it('deletes the capacity and returns success', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .delete(`/management/v1/capacity/${capacity.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        id: capacity.id,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server).delete(
        `/management/v1/capacity/${capacity.id}`
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
