import 'reflect-metadata';
import 'dotenv/config';

import { DataSource } from 'typeorm';

const folder = process.env.NODE_ENV === 'production' ? 'dist' : 'src';

const ssl =
  process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined;

const dataSource = new DataSource({
  name: process.env.POSTGRES_DB || 'gofilemanager',
  type: 'postgres',
  host: process.env.POSTGRES_HOST || 'localhost',
  port: Number(process.env.POSTGRES_PORT) || 5432,
  username: process.env.POSTGRES_USER || 'postgres',
  password: process.env.POSTGRES_PASS || 'docker',
  database: process.env.POSTGRES_DB || 'gofilemanager',
  ssl,
  entities: [`./${folder}/modules/**/infra/typeorm/entities/*{.js,.ts}`],
  migrations: [`./${folder}/shared/infra/typeorm/migrations/*{.js,.ts}`],
});

export default dataSource;
