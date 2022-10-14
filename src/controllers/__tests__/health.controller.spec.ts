import { Test, TestingModule } from '@nestjs/testing';

import { HealthController } from '../health.controller';

describe('controllers/health', () => {
  let healthController: HealthController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [],
    }).compile();

    healthController = app.get<HealthController>(HealthController);
  });

  describe('getHealth', () => {
    it('should return success', () => {
      expect(healthController.getHealth()).toStrictEqual({ success: true });
    });
  });
});
