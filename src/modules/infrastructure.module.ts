import { Logger, Module } from '@nestjs/common';

import { HealthController } from '../controllers/health.controller';
import { ServiceInfoController } from '../controllers/serviceInfo.controller';
import { Capacity, CapacityChange, EntitySource } from '../entities';
import {
  CapacityChangeRepository,
  CapacityRepository,
  EntitySourceRepository,
} from '../repositories';
import { AppService } from '../services/app.service';
import { provideCustomRepository } from '../utils/provideCustomRepository';

@Module({
  imports: [],
  controllers: [HealthController, ServiceInfoController],
  providers: [
    AppService,
    Logger,
    provideCustomRepository(Capacity, CapacityRepository),
    provideCustomRepository(CapacityChange, CapacityChangeRepository),
    provideCustomRepository(EntitySource, EntitySourceRepository),
  ],
})
export class InfrastructureModule {}
