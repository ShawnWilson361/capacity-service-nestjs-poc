import { nanoid } from 'nanoid';
import { v4 as uuid } from 'uuid';

export type CapacityModification = {
  amount: number;
  entityId: string;
  guestReferenceId: string;
  bookingReferenceId: string;
};

export type CapacityModificationPayload = {
  amount: number;
  entityId: string;
};

export const createCapacityModification = (
  modificationItem: Partial<CapacityModification> = {}
): CapacityModification => ({
  amount: 1,
  entityId: uuid(),
  guestReferenceId: nanoid(),
  bookingReferenceId: nanoid(),
  ...modificationItem,
});

export const convertCapacityModificationToPayload = (
  capacityModification: CapacityModification
): CapacityModificationPayload => ({
  entityId: capacityModification.entityId,
  amount: capacityModification.amount,
});
