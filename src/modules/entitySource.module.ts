import { Logger, Module } from '@nestjs/common';

import { EntitySourceV1Controller } from '../controllers/management/entitySource.v1.controller';
import { Capacity, CapacityChange, EntitySource } from '../entities';
import {
  CapacityChangeRepository,
  CapacityRepository,
  EntitySourceRepository,
} from '../repositories';
import { EntitySourceService } from '../services/entitySource.service';
import { provideCustomRepository } from '../utils/provideCustomRepository';

@Module({
  imports: [],
  controllers: [EntitySourceV1Controller],
  providers: [
    EntitySourceService,
    Logger,
    provideCustomRepository(Capacity, CapacityRepository),
    provideCustomRepository(CapacityChange, CapacityChangeRepository),
    provideCustomRepository(EntitySource, EntitySourceRepository),
  ],
})
export class EntitySourceModule {}
