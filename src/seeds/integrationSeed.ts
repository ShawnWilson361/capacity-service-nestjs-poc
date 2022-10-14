/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata';
import { DataSource } from 'typeorm';

import { EntitySource } from '../entities';
import entitySourceSeed from './entitySource.seed';

export const integrationSeed = async (ds: DataSource) => {
  const entitySourceRepository = ds.getRepository(EntitySource);
  await entitySourceRepository.delete({});
  await entitySourceRepository.save(entitySourceSeed());
};
