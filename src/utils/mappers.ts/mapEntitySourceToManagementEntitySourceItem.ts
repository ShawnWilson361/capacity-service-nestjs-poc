import { EntitySource } from '../../entities';
import { ManagementEntitySourceItem } from '../../types/shared';

export default (entitySource: EntitySource): ManagementEntitySourceItem => {
  return {
    keyReference: entitySource.keyReference,
    name: entitySource.name,
    id: entitySource.id,
    isLive: entitySource.isLive,
    createdAt: entitySource.createdAt.toISOString(),
    updatedAt: entitySource.updatedAt.toISOString(),
    deletedAt: entitySource.deletedAt?.toISOString(),
  };
};
