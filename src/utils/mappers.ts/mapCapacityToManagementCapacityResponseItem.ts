import { Capacity } from '../../entities';
import { ManagementCapacityResponseItem } from '../../types/shared';
import mapCapacityChangeToManagementCapacityChange from './mapCapacityChangeToManagementCapacityChange';

export default (capacity: Capacity): ManagementCapacityResponseItem => {
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
    changes: capacity.changes?.map((change) =>
      mapCapacityChangeToManagementCapacityChange(change, capacity.entityType)
    ),
  };
};
