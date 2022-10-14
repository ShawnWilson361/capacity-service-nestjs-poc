/* eslint-disable @typescript-eslint/no-floating-promises */
import 'reflect-metadata';

import { EntitySource } from '../entities';
import { AppDataSource } from '../ormconfig';
import entitySourceSeed from './entitySource.seed';

export const seed = async () => {
  await AppDataSource.initialize();

  console.log('Seeding the database...');

  console.log('Seeding the Entity Sources...');
  const entitySourceRepository = AppDataSource.getRepository(EntitySource);
  await entitySourceRepository.save(entitySourceSeed());

  process.exit(0);
};

seed();
