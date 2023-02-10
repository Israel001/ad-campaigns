import { DataSource } from 'typeorm';

import * as config from './ormconfig';

const dataSourceConfig = { ...config };
delete dataSourceConfig.synchronize;
delete dataSourceConfig.migrationsRun;
delete dataSourceConfig.logging;

export const dataSource = new DataSource(dataSourceConfig as any);
