import { ErrorItem } from '../../errors/types/ErrorItem';
import { CapacityModification } from './CapacityModification.dto';
import { CapacityModificationContext } from './CapacityModificationContext.dto';

export type CapacityModificationRequest = {
  change: CapacityModification;
  errors?: ErrorItem[];
  context: CapacityModificationContext;
};
