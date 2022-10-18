/* eslint-disable @typescript-eslint/no-floating-promises */
import * as chalk from 'chalk';
import 'reflect-metadata';

import { EntitySource } from '../entities';
import { AppDataSource } from '../ormconfig';
import entitySourceSeed from './entitySource.seed';

export const seed = async () => {
  await AppDataSource.initialize();

  console.log(chalk.greenBright('Seeding the database...'));

  console.log(chalk.greenBright('Seeding the Entity Sources...'));
  const entitySourceRepository = AppDataSource.getRepository(EntitySource);
  await entitySourceRepository.save(entitySourceSeed());

  process.exit(0);
};

seed();
