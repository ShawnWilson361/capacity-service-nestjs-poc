import { Logger, Module } from '@nestjs/common';

import { CapacityV1CompatibilityController } from '../controllers/public/capacity.v1.compatibility.controller';
import { CapacityV1Controller } from '../controllers/public/capacity.v1.controller';
import { Capacity, CapacityChange, EntitySource } from '../entities';
import {
  CapacityChangeRepository,
  CapacityRepository,
  EntitySourceRepository,
} from '../repositories';
import { CapacityService } from '../services/capacity.service';
import { CapacityChangeService } from '../services/capacityChange.service';
import { CapacityValidationService } from '../services/capacityValidation.service';
import { ConfigService } from '../services/config.service';
import { EntitySourceService } from '../services/entitySource.service';
import { provideCustomRepository } from '../utils/provideCustomRepository';

@Module({
  imports: [],
  controllers: [CapacityV1Controller, CapacityV1CompatibilityController],
  providers: [
    CapacityService,
    ConfigService,
    EntitySourceService,
    CapacityChangeService,
    CapacityValidationService,
    Logger,
    provideCustomRepository(Capacity, CapacityRepository),
    provideCustomRepository(CapacityChange, CapacityChangeRepository),
    provideCustomRepository(EntitySource, EntitySourceRepository),
  ],
})
export class PublicModule {}
