import { Capacity } from '../../entities';
import { ManagementCapacityItem } from '../../types/shared';

export default (capacity: Capacity): ManagementCapacityItem => {
  return {
    id: capacity.id,
    entityId: capacity.entityId,
    entityType: capacity.entityType,
    heldCapacity: capacity.heldCapacity,
    usedCapacity: capacity.usedCapacity,
    maxCapacity: capacity.maxCapacity,
    isLive: capacity.isLive,
    createdAt: capacity.createdAt.toISOString(),
    updatedAt: capacity.updatedAt.toISOString(),
    deletedAt: capacity.deletedAt?.toISOString(),
  };
};
