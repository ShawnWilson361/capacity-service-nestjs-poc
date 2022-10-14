import { HttpException, INestApplication, Logger } from '@nestjs/common';
import { ConfigService as NestJsConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import config from '../../../src/config';
import { Capacity } from '../../../src/entities';
import { ApplicationErrorFilter } from '../../../src/filters/applicationError.filter';
import { CapacityRepository } from '../../../src/repositories';
import { integrationSeed } from '../../../src/seeds/integrationSeed';
import { createCapacity } from '../helpers/capacity.helper';
import setupTestingModuleHelper from '../helpers/setupTestingModule.helper';

/**
 * @group integration
 */
describe('integration - public - capacity', () => {
  let app: INestApplication;
  let capacityRepository: CapacityRepository;
  let nestJsConfigService: NestJsConfigService;

  let activitiesApiKey: string;

  const entitySourceId = '537573c0-6755-460a-b55d-26c6a8412d65';

  let authHeaders: {
    Authorization: string;
    'x-api-key': string;
  };

  beforeEach(async () => {
    activitiesApiKey = uuid();
    authHeaders = {
      Authorization: 'Bearer test',
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

    const testingModule = setupTestingModuleHelper();

    const moduleRef = await testingModule
      .overrideProvider(NestJsConfigService)
      .useValue({ get: getConfigService })
      .compile();

    capacityRepository = await moduleRef.resolve<CapacityRepository>(
      CapacityRepository
    );

    const dataSource = await moduleRef.resolve<DataSource>(DataSource);

    nestJsConfigService =
      moduleRef.get<NestJsConfigService>(NestJsConfigService);

    await integrationSeed(dataSource);

    app = moduleRef.createNestApplication();
    app.useGlobalFilters(new ApplicationErrorFilter(new Logger()));
    await app.init();
  });

  afterEach(async () => {
    await capacityRepository.delete({});
    jest.resetAllMocks();
  });

  afterAll(async () => {
    await app?.close();
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

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
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
  });

  describe('[GET] /public/v1/capacity/:id', () => {
    it('returns a capacity object', async () => {
      jest.spyOn(nestJsConfigService, 'get').mockReturnValue(activitiesApiKey);

      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entitySourceId,
        })
      );

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
        .get(`/public/v1/capacity/${capacity.id}`)
        .set(authHeaders);

      expect(response.statusCode).toEqual(500);
      expect(response.body).toEqual({
        code: null,
        status: 500,
        message: 'error',
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

      const response = await request(app.getHttpServer())
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

      const response = await request(app.getHttpServer())
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
  });
});
