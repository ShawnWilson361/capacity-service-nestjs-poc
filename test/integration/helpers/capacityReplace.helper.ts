import { v4 as uuid } from 'uuid';

import { CapacityInfo } from '../../../src/types/shared';

export const createCapacityInfo = (
  entity: Partial<CapacityInfo> = {}
): CapacityInfo =>
  ({
    usedCapacity: 10,
    maxCapacity: 15,
    entityType: 'test-type',
    entityId: uuid(),
    ...entity,
  } as CapacityInfo);
