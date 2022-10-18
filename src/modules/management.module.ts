import { Logger, Module } from '@nestjs/common';

import { CapacityV1Controller } from '../controllers/management/capacity.v1.controller';
import { Capacity, CapacityChange, EntitySource } from '../entities';
import {
  CapacityChangeRepository,
  CapacityRepository,
  EntitySourceRepository,
} from '../repositories';
import { CapacityService } from '../services/capacity.service';
import { CapacityChangeService } from '../services/capacityChange.service';
import { CapacityValidationService } from '../services/capacityValidation.service';
import { EntitySourceService } from '../services/entitySource.service';
import { provideCustomRepository } from '../utils/provideCustomRepository';

@Module({
  imports: [],
  controllers: [CapacityV1Controller],
  providers: [
    CapacityService,
    CapacityChangeService,
    CapacityValidationService,
    EntitySourceService,
    Logger,
    provideCustomRepository(Capacity, CapacityRepository),
    provideCustomRepository(CapacityChange, CapacityChangeRepository),
    provideCustomRepository(EntitySource, EntitySourceRepository),
  ],
})
export class ManagementModule {}
