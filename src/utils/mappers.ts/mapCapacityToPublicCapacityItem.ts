import { Capacity } from '../../entities';
import { PublicCapacityItem } from '../../types/shared';

export default (capacity: Capacity): PublicCapacityItem => {
  return {
    id: capacity.id,
    entityId: capacity.entityId,
    entityType: capacity.entityType,
    heldCapacity: capacity.heldCapacity,
    usedCapacity: capacity.usedCapacity,
    maxCapacity: capacity.maxCapacity,
    createdAt: capacity.createdAt.toISOString(),
    updatedAt: capacity.updatedAt.toISOString(),
    deletedAt: capacity.deletedAt?.toISOString(),
  };
};
