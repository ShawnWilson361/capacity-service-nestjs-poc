import { nanoid } from 'nanoid';
import { v4 as uuid } from 'uuid';

import { EntitySource } from '../../../src/entities';

export const createEntitySource = (
  entity: Partial<EntitySource> = {}
): EntitySource => ({
  id: uuid(),
  name: uuid(),
  keyReference: nanoid().toUpperCase(),
  isLive: true,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: undefined,
  ...entity,
});
