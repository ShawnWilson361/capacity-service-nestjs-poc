import { Capacity, CapacityChange } from '../../entities';

export type CapacityModificationContext = {
  capacity: Capacity;
  capacityChanges: CapacityChange[];
};
