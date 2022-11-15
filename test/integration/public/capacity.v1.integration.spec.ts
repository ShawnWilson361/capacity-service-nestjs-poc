import { HttpException, INestApplication, Logger } from '@nestjs/common';
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
import { createCapacity } from '../helpers/capacity.helper';
import {
  convertCapacityModificationToPayload,
  createCapacityModification,
} from '../helpers/capacityModification.helper';
import createNestAppHelper from '../helpers/createNestApp.helper';
import setupTestingModuleHelper from '../helpers/setupTestingModule.helper';

/**
 * @group integration
 */
describe('integration - public - capacity - v1', () => {
  let app: INestApplication;
  let server: any;
  let capacityRepository: CapacityRepository;
  let capacityChangeRepository: CapacityChangeRepository;
  let nestJsConfigService: NestJsConfigService;

  let getFromAsyncContextOverride: jest.Func;

  let activitiesApiKey: string;

  const entitySourceId = '537573c0-6755-460a-b55d-26c6a8412d65';

  let authHeaders: {
    'x-api-key': string;
  };

  beforeEach(async () => {
    activitiesApiKey = uuid();
    authHeaders = {
      'x-api-key': activitiesApiKey,
    };

    const getConfigService = jest.fn((key: string) => {
      // this is being super extra, in the case that you need multiple keys with the `get` method
      if (key === 'ACTIVITIES_INTERNAL_API_KEY') {
        return activitiesApiKey;
      }
      if (key === 'database_connection') {
        return config().database_connection;
      }
      return null;
    });

    getFromAsyncContextOverride = jest
      .fn()
      .mockReturnValue('537573c0-6755-460a-b55d-26c6a8412d65');

    const testingModule = setupTestingModuleHelper({
      getFromAsyncContextOverride,
    });

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

    const dataSource = await moduleRef.resolve<DataSource>(DataSource);

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
    server?.close();
  });

  describe('[POST] /public/v1/capacity/batch', () => {
    it('returns a list of capacities', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const capacity2 = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .post(`/public/v1/capacity/batch`)
        .send({
          ids: [capacity.id, capacity2.id],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        items: [
          expect.objectContaining({
            entityId: capacity.entityId,
            entityType: capacity.entityType,
            heldCapacity: capacity.heldCapacity,
            id: capacity.id,
            maxCapacity: capacity.maxCapacity,
            usedCapacity: capacity.usedCapacity,
          }),
          expect.objectContaining({
            entityId: capacity2.entityId,
            entityType: capacity2.entityType,
            heldCapacity: capacity2.heldCapacity,
            id: capacity2.id,
            maxCapacity: capacity2.maxCapacity,
            usedCapacity: capacity2.usedCapacity,
          }),
        ],
      });
    });

    it('returns an empty array if item does not exist', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const response = await request(server)
        .post(`/public/v1/capacity/batch`)
        .send({
          ids: [uuid()],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        items: [],
      });
    });

    it('returns 500 if error thrown', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      jest
        .spyOn(capacityRepository, 'findCapacitiesByIdsAndEntitySource')
        .mockImplementation(() => {
          throw new HttpException('error', 500);
        });

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .post(`/public/v1/capacity/batch`)
        .send({
          ids: [capacity.id],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({
        code: null,
        status: 500,
        message: 'error',
        success: false,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .post(`/public/v1/capacity/batch`)
        .send({
          ids: [capacity.id],
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('[GET] /public/v1/capacity/:id', () => {
    it('returns a capacity object', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .get(`/public/v1/capacity/${capacity.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
        capacity: expect.objectContaining({
          entityId: capacity.entityId,
          entityType: capacity.entityType,
          heldCapacity: capacity.heldCapacity,
          id: capacity.id,
          maxCapacity: capacity.maxCapacity,
          usedCapacity: capacity.usedCapacity,
        }),
      });
    });

    it('returns 404 if capacity with id does not exist', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const response = await request(server)
        .get(`/public/v1/capacity/${uuid()}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(404);
    });

    it('returns 500 if error thrown', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      jest.spyOn(capacityRepository, 'findCapacity').mockImplementation(() => {
        throw new HttpException('error', 500);
      });

      const response = await request(server)
        .get(`/public/v1/capacity/${capacity.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({
        code: null,
        message: 'error',
        status: 500,
        success: false,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server).get(
        `/public/v1/capacity/${capacity.id}`
      );

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('[POST] /public/v1/capacity', () => {
    it('creates, saves and returns a capacity object', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity')
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

    it('returns 500 if error thrown', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      jest
        .spyOn(capacityRepository, 'createCapacity')
        .mockImplementation(() => {
          throw new HttpException('error', 500);
        });
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity')
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

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({
        code: null,
        status: 500,
        message: 'error',
        success: false,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity')
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
        code: 'unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('[POST] /public/v1/capacity/batch/create', () => {
    it('creates, saves and returns a single capacity object', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity/batch/create')
        .send({
          capacities: [
            {
              entityId: capacity.entityId,
              entityType: capacity.entityType,
              maxCapacity: capacity.maxCapacity,
              usedCapacity: capacity.usedCapacity,
              heldCapacity: capacity.heldCapacity,
              isLive: capacity.isLive,
              entitySourceId,
            } as Partial<Capacity>,
          ],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        results: [
          {
            capacity: expect.objectContaining({
              entityId: 'test',
            }),
            success: true,
          },
        ],
      });
    });

    it('creates, saves and returns multiple capacity object', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const capacity2 = createCapacity({
        entityId: 'test2',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity/batch/create')
        .send({
          capacities: [
            {
              entityId: capacity.entityId,
              entityType: capacity.entityType,
              maxCapacity: capacity.maxCapacity,
              usedCapacity: capacity.usedCapacity,
              heldCapacity: capacity.heldCapacity,
              isLive: capacity.isLive,
              entitySourceId,
            } as Partial<Capacity>,
            {
              entityId: capacity2.entityId,
              entityType: capacity2.entityType,
              maxCapacity: capacity2.maxCapacity,
              usedCapacity: capacity2.usedCapacity,
              heldCapacity: capacity2.heldCapacity,
              isLive: capacity2.isLive,
              entitySourceId,
            } as Partial<Capacity>,
          ],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(201);
      expect(response.body).toEqual({
        results: [
          {
            capacity: expect.objectContaining({
              entityId: 'test',
            }),
            success: true,
          },
          {
            capacity: expect.objectContaining({
              entityId: 'test2',
            }),
            success: true,
          },
        ],
      });
    });

    it('returns 500 if error thrown', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      jest
        .spyOn(capacityRepository, 'createCapacities')
        .mockImplementation(() => {
          throw new HttpException('error', 500);
        });

      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const capacity2 = createCapacity({
        entityId: 'test2',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity/batch/create')
        .send({
          capacities: [
            {
              entityId: capacity.entityId,
              entityType: capacity.entityType,
              maxCapacity: capacity.maxCapacity,
              usedCapacity: capacity.usedCapacity,
              heldCapacity: capacity.heldCapacity,
              isLive: capacity.isLive,
              entitySourceId,
            } as Partial<Capacity>,
            {
              entityId: capacity2.entityId,
              entityType: capacity2.entityType,
              maxCapacity: capacity2.maxCapacity,
              usedCapacity: capacity2.usedCapacity,
              heldCapacity: capacity2.heldCapacity,
              isLive: capacity2.isLive,
              entitySourceId,
            } as Partial<Capacity>,
          ],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({
        code: null,
        status: 500,
        message: 'error',
        success: false,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      const capacity = createCapacity({
        entityId: 'test',
        entitySourceId,
      });

      const capacity2 = createCapacity({
        entityId: 'test2',
        entitySourceId,
      });

      const response = await request(server)
        .post('/public/v1/capacity/batch/create')
        .send({
          capacities: [
            {
              entityId: capacity.entityId,
              entityType: capacity.entityType,
              maxCapacity: capacity.maxCapacity,
              usedCapacity: capacity.usedCapacity,
              heldCapacity: capacity.heldCapacity,
              isLive: capacity.isLive,
              entitySourceId,
            } as Partial<Capacity>,
            {
              entityId: capacity2.entityId,
              entityType: capacity2.entityType,
              maxCapacity: capacity2.maxCapacity,
              usedCapacity: capacity2.usedCapacity,
              heldCapacity: capacity2.heldCapacity,
              isLive: capacity2.isLive,
              entitySourceId,
            } as Partial<Capacity>,
          ],
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('[PATCH] /public/v1/capacity', () => {
    it('updates, saves and returns success', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 5,
            },
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
          'x-team-member-booking': true,
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
      });
    });

    it('updates, saves and returns success, if goes over full', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
          maxCapacity: 10,
          usedCapacity: 5,
        })
      );

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 10,
            },
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
          'x-team-member-booking': true,
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
      });
    });

    it('updates, saves and returns success, if already full and team member booking', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
          maxCapacity: 5,
          usedCapacity: 5,
        })
      );

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 10,
            },
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
          'x-team-member-booking': true,
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
      });
    });

    it('updates, saves and returns success for multiple changes', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const capacity2 = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test2',
          entitySourceId,
        })
      );
      const capacityModification1 = createCapacityModification({
        amount: 5,
        entityId: capacity.entityId,
        guestReferenceId: '123456',
      });
      const capacityModification2 = createCapacityModification({
        amount: 5,
        entityId: capacity2.entityId,
        guestReferenceId: '123456',
      });

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [capacityModification1, capacityModification2],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toEqual({
        success: true,
      });
    });

    it('returns 400, if already full and not team member booking', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
          maxCapacity: 5,
          usedCapacity: 0,
        })
      );

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 10,
            },
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        code: 'VALIDATION_ERROR',
        errors: [
          {
            errorCode: 'MAX_CAPACITY',
            message: 'Maximum capacity exceeded',
            path: '.body.changes[0]',
          },
        ],
        message: 'Validation error',
        status: 400,
        success: false,
      });
    });

    it('returns 400, if goes over full and not team member booking', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
          maxCapacity: 5,
          usedCapacity: 0,
        })
      );

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 10,
            },
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        code: 'VALIDATION_ERROR',
        errors: [
          {
            errorCode: 'MAX_CAPACITY',
            message: 'Maximum capacity exceeded',
            path: '.body.changes[0]',
          },
        ],
        message: 'Validation error',
        status: 400,
        success: false,
      });
    });

    it('returns 400 if error guest tries to book twice', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );
      const capacityModification1 = createCapacityModification({
        amount: 5,
        entityId: capacity.entityId,
        guestReferenceId: '123456',
      });
      const capacityModification2 = createCapacityModification({
        amount: 5,
        entityId: capacity.entityId,
        guestReferenceId: '123456',
      });

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            convertCapacityModificationToPayload(capacityModification1),
            convertCapacityModificationToPayload(capacityModification2),
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toEqual({
        success: false,
        code: 'VALIDATION_ERROR',
        status: 400,
        message: 'Validation error',
        errors: [
          {
            message: 'Duplicate entityId',
            path: '.body.changes',
          },
        ],
      });
    });

    it('returns 500 if error thrown', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      jest
        .spyOn(capacityRepository, 'findCapacitiesByEntityIdsAndEntitySource')
        .mockImplementation(() => {
          throw new HttpException('error', 500);
        });

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 5,
            },
          ],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
          'x-team-member-booking': true,
        });

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({
        code: null,
        status: 500,
        message: 'error',
        success: false,
      });
    });

    it('returns 401 no x-api-key header provided', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const response = await request(server)
        .patch('/public/v1/capacity')
        .send({
          changes: [
            {
              entityId: capacity.entityId,
              amount: 5,
            },
          ],
        })
        .set({
          'x-guest-reference-id': '123456',
          'x-booking-reference-id': 'SJ4578',
          'x-team-member-booking': true,
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });
  });

  describe('Keystore', () => {
    it('works correctly when keystore behaves', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const capacity2 = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .post(`/public/v1/capacity/batch`)
        .send({
          ids: [capacity.id, capacity2.id],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(200);
    });

    it('returns 401 when keystore empty', async () => {
      const getConfigService = jest.fn((key: string) => {
        // this is being super extra, in the case that you need multiple keys with the `get` method
        if (key === 'ACTIVITIES_INTERNAL_API_KEY') {
          return activitiesApiKey;
        }
        if (key === 'database_connection') {
          return config().database_connection;
        }
        return null;
      });

      getFromAsyncContextOverride = jest.fn().mockReturnValue(undefined);

      const testingModule = setupTestingModuleHelper({
        getFromAsyncContextOverride,
      });

      const moduleRef = await testingModule
        .overrideProvider(NestJsConfigService)
        .useValue({ get: getConfigService })
        .compile();

      const logger = await moduleRef.resolve<Logger>(Logger);

      app = await createNestAppHelper(moduleRef, logger);
      server = app.getHttpServer();

      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const capacity2 = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(server)
        .post(`/public/v1/capacity/batch`)
        .send({
          ids: [capacity.id, capacity2.id],
        })
        .set(authHeaders);

      expect(response.statusCode).toEqual(401);
    });
  });
});
