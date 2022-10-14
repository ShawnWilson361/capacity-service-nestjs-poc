import { v4 as uuid } from 'uuid';

import { Capacity } from '../../../src/entities';

export const createCapacity = (entity: Partial<Capacity> = {}): Capacity => ({
  id: uuid(),
  entityId: uuid(),
  entityType: uuid(),
  entitySourceId: uuid(),
  maxCapacity: 50,
  usedCapacity: 15,
  heldCapacity: 0,
  isLive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
  changes: [],
  ...entity,
});

export const createEntityResponse = <T>(entity: T): any =>
  JSON.parse(JSON.stringify(entity));
