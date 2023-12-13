import { entities } from 'src/db/entities';
import { DataSource, DataSourceOptions } from 'typeorm';
import 'dotenv/config';

export const databaseConf = {
  DB_TYPE: process.env.DB_TYPE ?? 'postgres',
  DB_HOST: process.env.DB_HOST ?? 'localhost',
  DB_PORT: parseInt(process.env.DB_PORT ?? '5432'),
  DB_USERNAME: process.env.DB_USER ?? 'postgres',
  DB_PASSWORD: process.env.DB_PASSWORD ?? 'shiv@123',
  DB_NAME: process.env.DB_NAME ?? 's3-operation',
};

export const ormConfig: DataSourceOptions = {
  host: databaseConf.DB_HOST,
  port: databaseConf.DB_PORT,
  username: databaseConf.DB_USERNAME,
  password: databaseConf.DB_PASSWORD,
  database: databaseConf.DB_NAME,
  type: databaseConf.DB_TYPE as any,
  entities: entities,
  subscribers: entities,
  logging: 'all',
  logger: 'simple-console',
};

export const AppDataSource = new DataSource(ormConfig);
