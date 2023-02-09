import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import path from 'path';
require('dotenv').config();

const config: TypeOrmModuleOptions = {
  type: 'mysql',
  charset: 'utf8mb4',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_DATABASE,
  entities: [
    path.join(__dirname, '..', '{entities,modules}/**/*.entity.{ts,js}'),
  ],
  keepConnectionAlive: true,
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  extra: {
    connectionLimit: 50,
  },
  migrationsRun: true,
  logging: false,
  logger: 'advanced-console',
  migrations: [path.join(__dirname, '..', '/migrations/**/*{.ts,.js}')],
};

export = config;
