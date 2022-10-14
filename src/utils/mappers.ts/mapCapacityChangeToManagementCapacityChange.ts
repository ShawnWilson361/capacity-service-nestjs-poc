import { CapacityChange } from '../../entities';
import { ManagementCapacityChange } from '../../types/shared';

export default (
  change: CapacityChange,
  entityType: string
): ManagementCapacityChange => {
  return {
    id: change?.id,
    amount: change?.amount,
    bookingReferenceId: change?.bookingReferenceId,
    capacityId: change?.capacityId,
    guestReferenceId: change?.guestReferenceId,
    entityType,
    createdAt: change.createdAt.toISOString(),
    updatedAt: change.updatedAt.toISOString(),
    deletedAt: change.deletedAt?.toISOString(),
  };
};
