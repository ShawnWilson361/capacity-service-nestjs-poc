import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import * as config from 'config';
import * as dotenv from 'dotenv';

import * as Entities from './entities';

if (!process.env.NODE_ENV) {
  dotenv.config({
    path: `.env`,
  });
}

export default () => ({
  envFilePath: '.env',
  database_connection: {
    type: 'postgres',
    entities: Object.values(Entities),
    migrations: ['migrations/*.js'],
    cli: {
      migrationsDir: 'migrations',
    },
    migrationsTableName: 'migrations',
    username: config.get('db.username'),
    password: config.get('db.password'),
    database: config.get('db.database'),
    host: config.get('db.host'),
    port: parseInt(config.get('db.port') || '33111'),
    keepConnectionAlive: true,
    logging: config.get('sequelize.logging'),
    charset: 'utf8_unicode_ci',
  } as TypeOrmModuleOptions,
});
