import { HttpException, INestApplication, Logger } from '@nestjs/common';
import { ConfigService as NestJsConfigService } from '@nestjs/config';
import * as request from 'supertest';
import { DataSource } from 'typeorm';
import { v4 as uuid } from 'uuid';

import config from '../../../src/config';
import {
  CapacityChangeRepository,
  CapacityRepository,
} from '../../../src/repositories';
import { integrationSeed } from '../../../src/seeds/integrationSeed';
import { createCapacity } from '../helpers/capacity.helper';
import { createCapacityInfo } from '../helpers/capacityReplace.helper';
import createNestAppHelper from '../helpers/createNestApp.helper';
import setupTestingModuleHelper from '../helpers/setupTestingModule.helper';

/**
 * @group integration
 */
describe('integration - public - capacity - compatibility', () => {
  let app: INestApplication;
  let server: any;
  let capacityRepository: CapacityRepository;
  let capacityChangeRepository: CapacityChangeRepository;
  let nestJsConfigService: NestJsConfigService;

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
    await app.close();
    server?.close();
  });

  describe('[PATCH] /public/v1-compatibility/capacity', () => {
    it('updates, replaces, saves and returns the capacities provided (increase)', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const capacityInfo = createCapacityInfo({
        entityId: capacity.entityId,
        usedCapacity: capacity.usedCapacity + 3,
        maxCapacity: capacity.maxCapacity,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        success: true,
        items: [
          expect.objectContaining({
            id: capacity.id,
            usedCapacity: capacityInfo.usedCapacity,
          }),
        ],
      });
    });

    it('updates, replaces, saves and returns the capacities provided (decrease)', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const capacityInfo = createCapacityInfo({
        entityId: capacity.entityId,
        usedCapacity: capacity.usedCapacity - 3,
        maxCapacity: capacity.maxCapacity,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        success: true,
        items: [
          expect.objectContaining({
            id: capacity.id,
            usedCapacity: capacityInfo.usedCapacity,
          }),
        ],
      });
    });

    it('updates, replaces, saves and returns the multiple capacities provided (increase)', async () => {
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

      const capacityInfo = createCapacityInfo({
        entityId: capacity.entityId,
        usedCapacity: capacity.usedCapacity + 3,
        maxCapacity: capacity.maxCapacity,
      });

      const capacityInfo2 = createCapacityInfo({
        entityId: capacity2.entityId,
        usedCapacity: capacity2.usedCapacity + 3,
        maxCapacity: capacity2.maxCapacity,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo, capacityInfo2],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        success: true,
        items: [
          expect.objectContaining({
            id: capacity.id,
            usedCapacity: capacityInfo.usedCapacity,
          }),
          expect.objectContaining({
            id: capacity2.id,
            usedCapacity: capacityInfo2.usedCapacity,
          }),
        ],
      });
    });

    it('updates, replaces, saves and returns the capacities provided (no value change)', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const capacityInfo = createCapacityInfo({
        entityId: capacity.entityId,
        usedCapacity: capacity.usedCapacity,
        maxCapacity: capacity.maxCapacity,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        success: true,
        items: [
          expect.objectContaining({
            id: capacity.id,
            usedCapacity: capacityInfo.usedCapacity,
          }),
        ],
      });
    });

    it('creates, saves and returns the capacities provided (increase)', async () => {
      const capacityInfo = createCapacityInfo({
        entityId: 'test',
        usedCapacity: 3,
        maxCapacity: 10,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        success: true,
        items: [
          expect.objectContaining({
            entityId: capacityInfo.entityId,
            usedCapacity: capacityInfo.usedCapacity,
          }),
        ],
      });
    });

    it('updates maxCapacity if capacity to update exists and usedCapacity is missing', async () => {
      const existingCapacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
          usedCapacity: Math.floor(Math.random() * 50),
        })
      );

      const { usedCapacity, ...capacityInfo } = createCapacityInfo({
        entityId: existingCapacity.entityId,
        maxCapacity: 156,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(200);
      expect(response.body).toStrictEqual({
        success: true,
        items: [
          expect.objectContaining({
            id: existingCapacity.id,
            entityId: capacityInfo.entityId,
            usedCapacity: existingCapacity.usedCapacity,
            maxCapacity: capacityInfo.maxCapacity,
          }),
        ],
      });
    });

    it('returns 500 when an error is thrown', async () => {
      const capacity = await capacityRepository.createCapacity(
        createCapacity({
          entityId: 'test',
          entitySourceId,
        })
      );

      const capacityInfo = createCapacityInfo({
        entityId: capacity.entityId,
        usedCapacity: capacity.usedCapacity + 3,
        maxCapacity: capacity.maxCapacity,
      });

      jest
        .spyOn(capacityRepository, 'upsertCapacity')
        .mockImplementation(() => {
          throw new HttpException('error', 500);
        });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
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

      const capacityInfo = createCapacityInfo({
        entityId: capacity.entityId,
        usedCapacity: capacity.usedCapacity + 3,
        maxCapacity: capacity.maxCapacity,
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        });

      expect(response.statusCode).toEqual(401);
      expect(response.body).toEqual({
        code: 'unauthorized',
        status: 401,
        message: 'Unauthorized',
        success: false,
      });
    });

    it('returns 400 if capacity to update does not exist and usedCapacity is missing', async () => {
      const { usedCapacity, ...capacityInfo } = createCapacityInfo({
        entityId: uuid(),
      });

      const response = await request(server)
        .patch('/public/v1-compatibility/capacity')
        .send({
          items: [capacityInfo],
        })
        .set({
          ...authHeaders,
          'x-guest-reference-id': '123456',
        });

      expect(response.statusCode).toEqual(400);
      expect(response.body).toStrictEqual(
        expect.objectContaining({
          code: 'BAD_REQUEST',
          status: 400,
          success: false,
        })
      );
    });
  });
});
