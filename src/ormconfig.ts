import * as config from 'config';
import { DataSource } from 'typeorm';

import * as Entities from './entities';

export const AppDataSource = new DataSource({
  type: 'postgres',
  username: config.get('db.username'),
  password: config.get('db.password'),
  database: config.get('db.database'),
  host: config.get('db.host'),
  port: parseInt(config.get('db.port') || '8543'),
  logging: true,
  entities: Object.values(Entities),
  subscribers: [],
  migrations: [__dirname + '/migrations/*{.js,.ts}'],
});
