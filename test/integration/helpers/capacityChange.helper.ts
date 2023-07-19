import { v4 as uuid } from 'uuid';

import { CapacityChange } from '../../../src/entities';

export const createCapacityChange = (
  entity: Partial<CapacityChange> = {}
): CapacityChange =>
  ({
    id: uuid(),
    amount: 2,
    capacityId: uuid(),
    guestReferenceId: uuid(),
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: undefined,
    ...entity,
  }) as any as CapacityChange;
